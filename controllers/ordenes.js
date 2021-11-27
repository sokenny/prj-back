import { generateMovimientosFromTransferencias } from '../GlobalFunctions.js';
import Orden from '../models/orden.js';
import Movimiento from '../models/movimiento.js';
import Cliente from '../models/cliente.js';
import Operacion from '../models/operacion.js';



export const getOrdenes = async (req, res)=>{

    const query = req.query
    const periodo = JSON.parse(query.periodo)

    var tipo =  query.tipo;
    if(query.tipo === ''){
        tipo = {
            $exists: true
        }
    }else{

        // El populate del proveedor esta anidado al subdocumento del tipo de la orden. Y varía por el tipo de orden. Así que el valor es dinámico. Lo armamos acá abajo:
        var tipo_for_populate = tipo.toLowerCase()
        if(tipo_for_populate === 'cash cash'){
            tipo_for_populate = 'cash'
        }
        var populate_proveedor = 'tipo_orden.'+tipo_for_populate+'.proveedor'

    }


    try{
       
        var ordenes = await Orden.find({
                                        tipo: tipo,
                                        fecha_creado:{
                                            $gte: periodo.from,
                                            $lt: periodo.to
                                        }
                                    }).populate('cliente').populate('operacion').populate('operador').populate(populate_proveedor).sort({fecha_creado: 'desc'}).exec()
        
        res.status(200).json(ordenes)
    }catch(error){
        res.status(404).json({message: error.message})
    }        

}

export const getOrdenesHoy = async (req, res)=>{
}



// export const createOrden = async(req, res) =>{

//     const operacion = req.body.operacionData;
//     const ordenes = req.body.ordenes;
//     const newOperacion = new Operacion(operacion);

//     console.log('REQBODY DESDE SERVER: ', req.body)

//     try{
//         await newOperacion.save().then(() => {
            
//             // Creamos las ordenes
//             for (let i = 0; i < ordenes.length; i++) {
                    
//                     var orden = ordenes[i];
//                     orden.operacion = newOperacion._id
//                     var newOrden = new Orden(orden)
                    
//                     console.log('Orduin: ', orden)
                    
//                     try{
//                         newOrden.save()
//                     }catch(error){
//                         console.log('error al crear orden: ', error)
//                     }
                    
//             }
            

//         });
//         res.status(201).json({newOperacion, ordenes})
//     }catch(error){
//         res.status(409).json({message: error.message})
//     }

// }



export const createOrdenSolo = async (req, res) =>{


    const ordenes = req.body;
    console.log('ordenes:::' , ordenes)

    try{

        for (let i = 0; i < ordenes.length; i++) {
            let orden = ordenes[i]
            orden.operador = req.operador
            
            if (orden.tipo == 'Saldo') {
                var clienteToUpdateSaldo = await Cliente.findById(orden.cliente);
                let saldo_total = clienteToUpdateSaldo.saldo;
                var operacion_vinculada = await Operacion.findById(orden.operacion);
                console.log(operacion_vinculada)
                var newMovimientoSaldo = {
                    operacion : operacion_vinculada,
                    monto : orden.usd,
                    // fecha : new Date()
                }
                    
                saldo_total.push(newMovimientoSaldo)
                var clienteToUpdateSaldo = await Cliente.findByIdAndUpdate(orden.cliente, { saldo: saldo_total })
                orden.estado = "Entregada"
            }

            // Si la orden tiene pesos asociados, le creamos un cambio
            if(orden.ars > 0){

                // TODO sacar esta hardcodeada de abajo porque el cambio global despues se va a traer posta
                req.body.cambio_global = 155

                let cambio = {
                    cliente: orden?.cliente,
                    cliente_borrador: orden?.cliente_borrador,
                    tipo_operacion: 'Cambio',
                    tipo_cambio: 'Compra',
                    monto_enviado: ((orden.ars) / orden.cambio_operacion).toFixed(2),
                    monto_a_entregar: orden.ars,
                    cambio_cliente: orden.cambio_operacion,
                    cambio_prj: req.body.cambio_global,
                    spread: orden.cambio_operacion - req.body.cambio_global,
                    operador: req.operador,
                    estado: 'Pendiente'
                }
                let newCambio = await new Operacion(cambio).save()
                console.log('Nuevo cambio creado: ', newCambio)

            }

            if(orden.tipo == 'Factura'){
                orden.tipo_orden.factura = {
                    monto_factura_usd: orden.usd,
                    monto_factura_ars: orden.ars,
                }
            }
            // if(orden.tipo == 'Cripto'){
            //     orden.tipo_orden.cripto = {
            //         comision: orden.tipo_orden.cripto.comision,
            //         usdt_a_enviar: orden.tipo_orden.cripto.usdt_a_enviar,
            //         wallet: orden.tipo_orden.cripto.wallet
            //     }
            // }
            var newOrden = new Orden(orden)
            console.log('newOeden:::' , newOrden)
            newOrden.save()
            res.status(201).json(newOrden)
        }

    }catch(error){
        console.log('error al crear orden: ', error)
    }
}

export const editOrdenes = async (req, res) =>{


        const ordenes = req.body;
        console.log('ordenes:::' , ordenes)
    
        try{
    
            for (let i = 0; i < ordenes.length; i++) {
                // Si la orden tiene pesos asociados, le creamos un cambio
                // if(orden.ars > 0){
    
                //     let cambio = {
                //         cliente: orden?.cliente,
                //         cliente_borrador: orden?.cliente_borrador,
                //         tipo_operacion: 'Cambio',
                //         tipo_cambio: 'Compra',
                //         monto_enviado: ((orden.ars) / orden.cambio_operacion).toFixed(2),
                //         monto_llega: orden.ars,
                //         cambio_cliente: null,
                //         cambio_prj: req.body.cambio_global,
                //         operador: req.operador,
                //         estado: 'Pendiente'
                //     }
                //     let newCambio = await new Operacion(cambio).save()
                //     console.log('Nuevo cambio creado: ', newCambio)
    
                // }
    
                // if(orden.tipo == 'Factura'){
                //     orden.tipo_orden.factura = {
                //         monto_factura_usd: orden.usd,
                //         monto_factura_ars: orden.ars,
                //     }
                // }
                // if(orden.tipo == 'Cripto'){
                //     orden.tipo_orden.cripto = {
                //         comision: orden.tipo_orden.cripto.comision,
                //         usdt_a_enviar: orden.tipo_orden.cripto.usdt_a_enviar,
                //         wallet: orden.tipo_orden.cripto.wallet
                //     }
                // }
                var newOrdenEdit = new Orden(orden)
                // var editedOrden = await Orden.findOneAndUpdate( id : newOrdenEdit.operacion._id, {new: true})
                // var clienteToUpdate = await Orden.findOneAndUpdate(filter, cliente, {new: true})

                console.log('newOeden:::' , newOrdenEdit)
                // newOrden.save()
                res.status(201).json(editedOrden)
            }
    
    
        }catch(error){
            console.log('error al crear orden: ', error)
        }

}


export const createFactura = async (req, res) =>{
    req.body.factura.operador = req.operador
    const factura = req.body.factura;

    var newFactura = new Orden(factura)
    newFactura.operacion = req.body.operacionj
    newFactura.cliente = req.body.cliente

    try{
        try{
            // console.log(newFactura)
            await newFactura.save().then(f => f.populate('operacion').populate('cliente').execPopulate())
        }catch(error){
        }

        res.status(201).json(newFactura)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const updateFactura = async (req, res) =>{

    const factura = req.body;
    const filter = {_id: factura._id}

    var facturaToUpdate = await Orden.findOneAndUpdate(filter, factura, {new: true}).populate('cliente').populate('operacion').exec()

    try{            
                
        res.status(201).json(facturaToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const deleteOrden = async (req, res)=>{
    
    const id = req.params.id;

    await Orden.findByIdAndRemove(id)
    
    res.json({message: 'Orden deleted succesfully', id: id})

}

export const createCash = async (req, res) =>{
    req.body.cash.operador = req.operador
    const cash = req.body.cash;

    var newCash = new Orden(cash)
    newCash.operacion = req.body.operacion
    newCash.cliente = req.body.cliente

    try{            
                
        try{
            await newCash.save().then(f => f.populate('operacion').populate('cliente').populate('tipo_orden.cash.proveedor').execPopulate()).then(()=>{

                var estado_movimiento = 'Enviado'
                if(newCash.estado === 'Pagado'){
                    estado_movimiento = 'Acreditado'
                }

                // Ya creado el cash, creamos el movimiento con ese proveedor
                const movimiento = {proveedor: newCash.tipo_orden.cash.proveedor, origen: newCash.tipo + '(' + newCash._id + ')', estado: estado_movimiento, importe: newCash.tipo_orden.cash.monto_envio}
                const newMovimiento = new Movimiento(movimiento);
                try{
                    newMovimiento.save();
                }catch(error){
                    console.log('Error al crear movimiento : ', error)
                }

            })
        }catch(error){
            console.log('error al crear cash cash: ', error)
        }

        res.status(201).json(newCash)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const updateCash = async (req, res) =>{

    const cash = req.body;
    const filter = {_id: cash._id}

    
    
    try{            

        var cashToUpdate = await Orden.findOneAndUpdate(filter, cash, {new: true}).populate('cliente').populate('operacion').populate('tipo_orden.cash.proveedor').exec()
        res.status(201).json(cashToUpdate)
        console.log('cash actualizada desde el controlador: ', cashToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const setListas = async (req, res) =>{

    const ordenes = req.body;
    console.log('ordenes desde controller setlistas: ', ordenes)

    let idsArray = []

    for(let o in ordenes){
        idsArray.push(ordenes[o]._id)
    }

    let filter = {_id: {$in: idsArray}}

    var updatedOrdenes = await Orden.updateMany(filter, {lista: true}, {new: true}).populate('cliente').populate('operacion').populate('tipo_orden.cash.proveedor').exec()

    res.status(201).json(idsArray)

    console.log('updated listas ords: ', updatedOrdenes)


}

export const liquidarTransferencias = async (req, res) =>{

    const data = req.body
    let movimientos = generateMovimientosFromTransferencias(data)
    try {
        for(let movimiento of movimientos){
            const newMovimiento = new Movimiento(movimiento);
            newMovimiento.save();
        }
        res.status(201).json({error: 0})
    }catch(error){
        res.status(409).json({error: 1, message: error.message})
    }

}