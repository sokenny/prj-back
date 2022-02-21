import Operacion from '../models/operacion.js';
import Orden from '../models/orden.js';
import * as utils from './utils/index.js';
import { parseEmptyFieldsToNull } from '../GlobalFunctions.js';

export const getOperaciones = async (req, res)=>{
    const query = req.query
    const periodo = JSON.parse(query.periodo)
    var tipo =  query.tipo;
    if(query.tipo === ''){
        tipo = {
            $exists: true
            }
    }
    try{
        var operaciones = await Operacion.find({
                                                tipo_operacion: tipo,
                                                fecha_creado:{
                                                    $gte: periodo.from,
                                                    $lt: periodo.to
                                                }
                                            }).populate('cliente').populate('proveedor').populate('cuenta_destino').populate('proveedor_as_cliente').populate('operador').sort({fecha_creado: 'desc'}).exec()


        res.status(200).json(operaciones)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const hasOrden = async (req, res)=>{
    const id = req.params.id;
    try{
        var ordenesAsociadas = await Orden.find({
                                                operacion: id,
                                            }).exec()
        if(ordenesAsociadas.length>0){
            res.status(200).json({error: 0, hasOrden: true})
        }else{
            res.status(200).json({error: 0, hasOrden: false})
        }       
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const getClienteOperaciones = async (req, res)=>{
    const {id} = req.params;
    try{
        const clienteOperaciones = await Operacion.find({id_cliente: id}).sort({fecha_creado: 'desc'}).exec();
        
        res.status(200).json(clienteOperaciones)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}


export const createOperacion = async(req, res) =>{
    req.body.operador = req.operador
    let operacion = parseEmptyFieldsToNull(req.body);
    const newOperacion = new Operacion(operacion);
    const operacionesToReturn = [newOperacion]
    try{
        await newOperacion.save().then(o => o.populate('cliente').populate('proveedor').populate('proveedor_as_cliente').populate('cuenta_destino').populate('operador').execPopulate());
        res.status(201).json({operaciones: operacionesToReturn})
    }catch(error){
        console.log('Error: ', error)
        res.status(409).json({message: error.message})
    }
}

export const deleteOperacion = async (req, res)=>{
    const id = req.params.id;
    await Operacion.findByIdAndRemove(id)
    res.json({message: 'Operacion deleted succesfully', id: id})
}

export const updateOperacion = async (req, res) =>{
    const operacion = req.body
    const filter = {_id: req.body._id}
    var updatedOperacion = await Operacion.findOneAndUpdate(filter, operacion, {new: true}).populate('proveedor').populate('cuenta_destino').populate('cliente').exec()
    try{            
        res.status(201).json(updatedOperacion)
    }catch(error){
        res.status(409).json({message: error.message})
    }
}