import Operacion from '../models/operacion.js';
import Orden from '../models/orden.js';
import MovimientoCaja from '../models/movimiento_caja.js';
import Movimiento from '../models/movimiento.js';
import Cliente from '../models/cliente.js';

export const favRow = async(req, res) =>{

    const data = req.body;

    try{
        if(data.tipo === 'operaciones'){
            await Operacion.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo === 'ordenes' || data.tipo == 'facturas' || data.tipo == 'cash'){
            await Orden.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo === 'clientes'){
            await Cliente.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo === 'cajas'){
            await MovimientoCaja.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }
        res.status(201).json()
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const changeEstado = async(req, res) =>{

    const data = req.body;

    try{
        if(data.tipo === 'operaciones'){
            await Operacion.findByIdAndUpdate(data.row_data._id, {estado: data.value});
        }else if(data.tipo === 'ordenes' || data.tipo == 'ordenes de hoy' || data.tipo == 'operaciones sin órdenes' || data.tipo == 'depositos'){
            await Orden.findByIdAndUpdate(data.row_data._id, {estado: data.value} );
        }else if(data.tipo === 'facturas' || data.tipo == 'cash'){
            await Orden.findByIdAndUpdate(data.row_data._id, {estado: data.value});
        }else if(data.tipo === 'proveedores'){
            // Actualizamos el estado de la operacion que pueda tener asociada, a "Confirmado"
            await Movimiento.findByIdAndUpdate(data.row_data._id, {estado: data.value})
            if(data.row_data.operacion && data.value === 'Acreditado'){
                await Operacion.findByIdAndUpdate(data.row_data.operacion, {estado: 'Confirmado', corroborar: false})
            }
        }

        res.status(201).json()
    }catch(error){
        res.status(409).json({message: error.message})
    }

}


// ------------------------
// Acá abajo estoy poniendo los helpers que usan algunos metodos del controlador
async function handleCreateMovimientoAsociado(data){
    for(let  currency of ['ars', 'usd']){
        if(data.row_data[currency] > 0){
            let newMovimientoCaja = {caja: currency.toUpperCase(), oficina: data.row_data.oficina, tipo: 0, importe: data.row_data[currency], categoria: 'Orden', binded_orden: data.row_data._id, descripcion: `Orden ${data.row_data._id}` }
            let movimientoAsociadoExistente = await MovimientoCaja.find({binded_orden: data.row_data._id, caja: currency.toUpperCase()})
            if(movimientoAsociadoExistente.length < 1){
                newMovimientoCaja = new MovimientoCaja(newMovimientoCaja);
                try{
                    await newMovimientoCaja.save()
                }catch(error){
                }
            }
        }
    }
}