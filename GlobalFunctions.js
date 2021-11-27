export const tipos = {
    operaciones: ['Bajada', 'Subida', 'Cambio', 'Crypto'],
    ordenes: ['Moto', 'Retira', 'Depósito', 'Factura', 'Cash Cash', 'Saldo', 'Cripto', 'Transferencia'],
    clientes: ['Boca en Boca', 'Foro', 'Bauti'],
}

export const estados = {
    operaciones: ['Pendiente', 'Foto', 'Comprobante', 'Confirmado'],
    cambios: ['Pendiente', 'Foto', 'Comprobante', 'Confirmado'],
    ordenes: ['Pendiente', 'Entregada'],
    facturas: ["Pendiente", "Pagado"],
    movimientos_proveedor: ['Enviado', 'Acreditado'],
    cash: ['Pendiente', 'Pagado'],
    depositos: ['Pendiente', 'Entregada'],

}


export const ordenAffectsCajaFisica = (orden) => {
    return (orden === 'Moto' || orden === 'Retira' || orden === 'Depósito')
}

export const isPesos = (transferencia) => {
    return (transferencia.ars > 0 && transferencia.usd < 1)
}

export const generateMovimientosFromTransferencias = (data) => {

    const movimientos = []

    for(let transferencia of data.transferencias){

        let movimiento = {proveedor: data.proveedor._id, estado: estados.movimientos_proveedor[0], cuenta_destino: data.cuenta_destino, origen: `Orden ${transferencia._id}`}
        let importe;
        if(transferencia.cotizacion){
            if(data.proveedor.divisa === 'USD' || data.proveedor.divisa === 'Crypto'){
                importe = (transferencia.ars / transferencia.cotizacion).toFixed(2)
            }else if(data.proveedor.divisa === 'ARS'){
                importe = Math.round(transferencia.usd * transferencia.cotizacion)
            }
        }else{
            if(isPesos(transferencia)){
                importe = transferencia.ars
            }else{
                importe = transferencia.usd
            } 
        }

        movimiento.importe = importe
        movimientos.push(movimiento)
        
    }

    return movimientos

}

export const getCajasDataStructure = ()=>{

    const oficinas = ['Callao', 'Microcentro', 'Belgrano']
    const divisas = ['ARS', 'EUR', 'USD']

    let cajas = {}
    for(let o of oficinas){
        cajas[o] = {}
        for(let d of divisas){
            cajas[o][d] = {egresos: 0, ingresos: 0}
        }
    }

    return cajas

}