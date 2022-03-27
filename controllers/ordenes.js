import { generateMovimientosFromTransferencias } from '../GlobalFunctions.js';
import Orden from '../models/orden.js';
import Movimiento from '../models/movimiento.js';
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
                                    }).populate({
                                        path: 'operacion',
                                        model: 'Operaciones',
                                        populate:{
                                            path:'cliente',
                                            model: 'Clientes'
                                        }
                                        }).populate('operador').populate(populate_proveedor).sort({fecha_creado: 'desc'}).exec()
        
        res.status(200).json(ordenes)
    }catch(error){
        res.status(404).json({message: error.message})
    }        

}

export const getOrdenesHoy = async (req, res)=>{
}

export const createOrdenSolo = async (req, res) =>{

    const ordenes = req.body;
    var responseArr = []

    try{

        for (let i = 0; i < ordenes.length; i++) {
            let orden = ordenes[i]
            orden.operador = req.operador
            orden = fillOrdenSubDocuments(orden)
            var newOrden = new Orden(orden)
            await newOrden.save().then(o => o.populate({
                path: 'operacion',
                model: 'Operaciones',
                populate:{
                    path:'cliente',
                    model: 'Clientes'
                }
            }).execPopulate());

            responseArr.push(newOrden);
        }

        res.status(201).json(responseArr)

    }catch(error){
        console.log('error al crear orden: ', error)
    }
}


export const editOrdenes = async (req, res) =>{
        const ordenes = req.body;
        var responseArr = []
        console.log('ordenes que llegan al edit ordenes: ', ordenes)
        try{

            for (let i = 0; i < ordenes.length; i++) {
                let orden = ordenes[i]
                orden.operador = req.operador
                var newOrdenEdit = new Orden(orden)
                var editedOrden = await Orden.findOneAndUpdate( {_id: newOrdenEdit._id}, newOrdenEdit, {new: true}).then(o => o.populate({
                    path: 'operacion',
                    model: 'Operaciones',
                    populate:{
                        path:'cliente',
                        model: 'Clientes'
                    }
                }).execPopulate());
                responseArr.push(editedOrden);
            }
            res.status(201).json(responseArr)    
        }catch(error){
            console.log('error al editar orden: ', error)
        }
}


export const createFactura = async (req, res) =>{
    req.body.factura.operador = req.operador
    const factura = {...req.body.factura, ars: req.body.factura.tipo_orden.factura.monto_factura_ars};
    var newFactura = new Orden(factura)
    try{
        newFactura = await newFactura.save().then(f => 
            f.populate({
            path: 'operacion',
            model: 'Operaciones',
            populate:{
                path:'cliente',
                model: 'Clientes'
            }
            }).populate('operador').execPopulate())

        res.status(201).json([newFactura])
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const deleteOrden = async (req, res)=>{
    const id = req.params.id;
    console.log(id)
    await Orden.findByIdAndRemove(id)
    res.json({message: 'Orden deleted succesfully', id: id})
}

export const createCash = async (req, res) =>{
    req.body.cash.operador = req.operador
    const cash = {...req.body.cash, usd: req.body.cash.tipo_orden.cash.monto_cliente};
    console.log('controller createcash: ', cash)
    var newCash = new Orden(cash)
    newCash.operacion = req.body.operacion
    newCash.cliente = req.body.cliente

    try{            
        try{
            await newCash.save().then(f => f.populate({
                path: 'operacion',
                model: 'Operaciones',
                populate:{
                    path:'cliente',
                    model: 'Clientes'
                }
                }).populate('operador').populate('tipo_orden.cash.proveedor').execPopulate()).then(()=>{
            })
        }catch(error){
            console.log('error al crear cash cash: ', error)
        }
        res.status(201).json([newCash])   
    }catch(error){
        res.status(409).json({message: error.message})
    }
}

// export const setListas = async (req, res) =>{

//     const ordenes = req.body;
//     let idsArray = []
//     for(let o in ordenes){
//         idsArray.push(ordenes[o]._id)
//     }
//     let filter = {_id: {$in: idsArray}}
//     var updatedOrdenes = await Orden.updateMany(filter, {lista: true}, {new: true}).populate({
//         path: 'operacion',
//         model: 'Operaciones',
//         populate:{
//             path:'cliente',
//             model: 'Clientes'
//         }
//         }).populate('operador').populate('tipo_orden.cash.proveedor').exec()
//     res.status(201).json(idsArray)

// }

export const liquidarTransferencias = async (req, res) =>{

    const data = req.body
    let movimientos = generateMovimientosFromTransferencias(data)

    try {
        for(let movimiento of movimientos){
            console.log('MOv a cargar: ', movimiento)
            movimiento.comision = data.comision;
            const newMovimiento = new Movimiento(movimiento);
            newMovimiento.save();
        }
        res.status(201).json({error: 0})
    }catch(error){
        res.status(409).json({error: 1, message: error.message})
    }

}

export async function findOrdenesWithFilters(req, res){
    try{
        const filtros = req.query
        const existingOrden = await Orden.find({...filtros})
        res.status(201).json({error: 0, ordenes: existingOrden})
    }catch(e){
        res.status(409).json({error: 1, message: error.message})   
    }
}

function fillOrdenSubDocuments(orden){
    switch(orden.tipo){
        case "Factura":
            orden.tipo_orden = {
                factura:{
                    monto_factura_ars: orden.ars,
                }
            }
            break;
    }
    return orden;
}