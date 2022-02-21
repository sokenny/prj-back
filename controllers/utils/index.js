

import Operacion from '../../models/operacion.js';
import Movimiento from '../../models/movimiento.js';

export const createSubidaFromOperacion = async (newOperacion) => {
    const operacionSubida = {cliente:newOperacion.cliente_recibe, monto_enviado: newOperacion.monto_llega, tipo_operacion: 'Subida', estado:'Pendiente', oficina: newOperacion.oficina}
    const newOperacionSubida = new Operacion(operacionSubida);
    try{
        await newOperacionSubida.save().then(o => o.populate('cliente').execPopulate())
        return newOperacionSubida
    }catch(error){
        console.log('Error al crear operacion subida: ', error)
    }
}

export const tryCreateMovimientoFromOperacion = async (operacion) => {
    let movimientoAsociadoExistente = await Movimiento.find({operacion: operacion._id})
    if(movimientoAsociadoExistente.length < 1){
        const movimiento = {proveedor: operacion.proveedor, cuenta_destino: operacion.cuenta_destino, operacion: operacion._id, importe: operacion.monto_llega, origen: operacion.cuenta_origen + ' ('+operacion.tipo_operacion+')', comision: operacion.comision_proveedor, estado: 'Enviado'}
        const newMovimiento = new Movimiento(movimiento);
        try{
            newMovimiento.save();
        }catch(error){
            console.log('Error al crear movimiento : ', error)
        }
    }
}

export const createTransferenciaProveedorFromOperacion = (operacion) => {
    let proveedor_transferencia = JSON.parse(operacion.proveedor_transferencia)
    let importe;
    // TODO des-hardcodear este cambio_proveedor
    let cambio_proveedor = 150;
    proveedor_transferencia.divisa === 'ARS' ? importe = -Math.round(operacion.monto_a_entregar * cambio_proveedor) : importe = -operacion.monto_a_entregar
    let movimientoProveedor = {proveedor: proveedor_transferencia._id, importe, estado: 'Enviado', comision: 0}
    const newMovimiento = new Movimiento(movimientoProveedor);
    try{
        newMovimiento.save()
    }catch(error){
        console.log('Error al crear movimiento : ', error)
    }
}

export const createPotentialCollateralActions = async (operacion) => {
    const potentialNewOperaciones = []
    if(operacion.tipo_operacion === 'Bajada' || operacion.tipo_operacion === 'Crypto'){
        if(operacion.tipo_recibe === 'Cliente'){ 
            const newSubida = await createSubidaFromOperacion(operacion)
            potentialNewOperaciones.push(newSubida)
        }
        if(operacion.recibe_transferencia){
            createTransferenciaProveedorFromOperacion(operacion)
        }
    }
    return potentialNewOperaciones;
}