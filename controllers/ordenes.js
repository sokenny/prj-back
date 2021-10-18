import mongoose from 'mongoose';
import Orden from '../models/orden.js';
import Movimiento from '../models/movimiento.js';

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
    
    try{            
        // Creamos las ordenes
        for (let i = 0; i < ordenes.length; i++) {
                var orden = ordenes[i];
                orden.operador = req.operador
                // orden.operacion = newOperacion._id
                console.log('se va a crear: ', orden)
                var newOrden = new Orden(orden)
                
                try{
                    newOrden.save()
                }catch(error){
                    console.log('error al crear orden: ', error)
                }
            }

            res.status(201).json(newOrden)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}


export const createFactura = async (req, res) =>{
    req.body.factura.operador = req.operador
    const factura = req.body.factura;

    var newFactura = new Orden(factura)
    newFactura.operacion = req.body.operacion
    newFactura.cliente = req.body.cliente

    try{            
                
        try{
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

    var cashToUpdate = await Orden.findOneAndUpdate(filter, cash, {new: true}).populate('cliente').populate('operacion').populate('tipo_orden.cash.proveedor').exec()

    console.log('cash actualizada desde el controlador: ', cashToUpdate)

    try{            
                
        res.status(201).json(cashToUpdate)
            
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