export const tipos = {
    operaciones: ['Bajada', 'Subida', 'Cambio', 'Crypto'],
    ordenes: ['Moto', 'Retira', 'Depósito', 'Factura', 'Cash Cash', 'Crypto', 'Transferencia'],
    clientes: ['Boca en Boca', 'Foro', 'Bauti'],
}

export const estados = {
    operaciones: ['Pendiente', 'Foto', 'Comprobante', 'Confirmado'],
    cambios: ['Pendiente', 'Foto', 'Comprobante', 'Confirmado'],
    ordenes: ['Pendiente', 'Entregada'],
    movimientos_proveedor: ['Enviado', 'Acreditado'],
}


export const ordenAffectsCajaFisica = (orden) => {
    return (orden === 'Moto' || orden === 'Retira' || orden === 'Depósito')
}

export const isPesos = (transferencia) => {
    return (transferencia.ars > 0 && transferencia.usd < 1)
}

function getNombreYIdOrd(movimiento) {
    return movimiento.operacion.cliente?.nombre + " - Ord (" + movimiento._id+")"
}

export const generateMovimientosFromTransferencias = (data) => {
    const movimientos = []
    for(let transferencia of data.transferencias){
        let movimiento = {proveedor: data.proveedor._id, estado: estados.movimientos_proveedor[0], cuenta_destino: data.cuenta_destino, origen:  getNombreYIdOrd(transferencia), orden: transferencia._id }
        let importe;
        if (transferencia.recibo === false) {
            if(isPesos(transferencia)){
                importe = transferencia.ars * (-1)
            }else{
                importe = transferencia.usd * (-1)
            }
            if (transferencia.tipo_orden.crypto) {
                importe= transferencia.tipo_orden.crypto.usdt_a_enviar
            }
        }else{
                importe = transferencia.operacion.monto_llega
        }
        movimiento.importe = importe
        movimientos.push(movimiento)
    }
    return movimientos

}

export const oficinas = ['Callao', 'Microcentro', 'Belgrano']
export const divisas = ['ARS', 'EUR', 'USD']

export const getCajasDataStructure = ()=>{

    let cajas = {}
    for(let o of oficinas){
        cajas[o] = {}
        for(let d of divisas){
            cajas[o][d] = {egresos: 0, ingresos: 0}
        }
    }

    return cajas

}

export const getBalancesDataStructure = ()=>{

    let balancesDataStructure = {}
    for(let oficina of oficinas){
        balancesDataStructure[oficina] = {}
        for(let divisa of divisas){
            balancesDataStructure[oficina][divisa] = {balance: 0}
        }
    }

    return balancesDataStructure

}

export const parseEmptyFieldsToNull = (objectToParse) => {
    for(let key of Object.keys(objectToParse)){
        if(objectToParse[key] === ""){
            objectToParse[key] = null
        }
    }   
    return objectToParse    
}