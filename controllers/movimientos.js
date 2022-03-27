import Movimiento from '../models/movimiento.js';
import MovimientoCaja from '../models/movimiento_caja.js';
import {Parser} from 'json2csv';

export const getMovimientos = async (req, res)=>{
    try{
        const movimientos = await Movimiento.find().populate('proveedor').populate('cuenta_destino').populate('operacion').populate('orden').sort({fecha_creado: 'desc'}).exec();
        res.status(200).json(movimientos)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createMovimientoProveedor = async(req, res) =>{
    
    var movimientoProveedor = req.body;

    if(movimientoProveedor.importe<=-1){
        movimientoProveedor.origen == null;    
        movimientoProveedor.cuenta_destino == null;    
        movimientoProveedor.comision == null;    
        
    }
    
    var newMovimiento = new Movimiento(movimientoProveedor);
    
    try{
        await newMovimiento.save().then(m => m.populate('proveedor').populate('cuenta_destino').execPopulate())
        res.status(201).json(newMovimiento)       
    }catch(error){
        console.log(error)
        res.status(409).json({message: error.message})
    }
    
}

export const deleteMovimientoProveedor = async (req, res)=>{
    const id = req.params.id;
    await Movimiento.findByIdAndRemove(id)
    res.json({message: 'Movimiento proveedor deleted succesfully', id: id})
}

export const createMovimientoCaja = async(req, res) =>{
    const movimientoCaja = req.body;
    console.log('mov caja a crear: ', movimientoCaja)
    const newMovimientoCaja = new MovimientoCaja(movimientoCaja);
    try{
        await newMovimientoCaja.save()  
        console.log('mov created: ', newMovimientoCaja)  
        res.status(201).json({newMovimientoCaja})
    }catch(error){
        console.log(error)
        res.status(409).json({message: error.message})
    }
}

export async function findMovimientosCajaWithFilters(req, res){
    try{
        const filtros = req.query
        const existingMovimiento = await MovimientoCaja.find({ descripcion: { $regex: filtros.orden } })
        console.log('existing',existingMovimiento)
        
        res.status(201).json({error: 0, movimientos: existingMovimiento})
    }catch(e){
        res.status(409).json({error: 1, message: error.message})   
    }
}

export const getMovimientosCajas = async (req, res)=>{
    try{
        const movimientosCajas = await MovimientoCaja.find().populate('operacion').populate('orden').sort({fecha_creado: 'desc'});
        res.status(200).json(movimientosCajas)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const deleteMovimientoCaja = async (req, res)=>{
    
    const id = req.params.id;
    await MovimientoCaja.findByIdAndRemove(id)
    res.json({message: 'Movimiento proveedor deleted succesfully', id: id})
    
}


export const updateMovimientoProveedor = async (req, res) =>{

    const movimiento = req.body;
    const filter = {_id: movimiento._id}
    var movimientoToUpdate = await Movimiento.findOneAndUpdate(filter, movimiento, {new: true}).populate('proveedor').exec()

    try{            
                
        res.status(201).json(movimientoToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}


export const updateMovimientoCaja = async (req, res) =>{

    const movimiento = req.body;
    const filter = {_id: movimiento._id}

    var movimientoToUpdate = await MovimientoCaja.findOneAndUpdate(filter, movimiento, {new: true})

    try{            
                
        res.status(201).json(movimientoToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const exportMovimientosCajas = async (req,res) =>{

    // Acá después hay que hacer que reciba un rango de fechas :P
    let filtros = req.query;

    const movimientosCajas = await MovimientoCaja.find(filtros).sort({fecha_creado: 'desc'});
    
    // Agregandole un "-" a los importes de tipo "0" (egresos)
    let data = []
    for(let mov of movimientosCajas){
        if(mov.tipo === 0){
            mov.importe = -mov.importe
        }
        data.push(mov)
    }

    const fields = [
        {
            label: 'Fecha creado',
            value: 'fecha_creado'
        }, 
        {
            label: 'Caja',
            value: 'caja'
        },
        {
            label: 'Importe',
            value: 'importe'
        },
        {
            label: 'Oficina',
            value: 'oficina'
        },
        {
            label: 'Categoria',
            value: 'categoria'
        },
    ]

    const json2csv = new Parser({ fields: fields })

    try {
        const csv = json2csv.parse(data)
        res.attachment('data.csv')
        res.status(200).send(csv)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export async function findMovimientosProveedorWithFilters(req, res){
    try{
        const filtros = req.query
        const existingMovimiento = await Movimiento.find({...filtros})
        res.status(201).json({error: 0, movimientos: existingMovimiento})
    }catch(e){
        res.status(409).json({error: 1, message: error.message})   
    }
}