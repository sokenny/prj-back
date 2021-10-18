import mongoose from 'mongoose';
import Movimiento from '../models/movimiento.js';
import MovimientoCaja from '../models/movimiento_caja.js';
import {Parser} from 'json2csv';

export const getMovimientos = async (req, res)=>{
    console.log('controller getMovimientos')
    try{

        const movimientos = await Movimiento.find().populate('proveedor').populate('cuenta_destino').sort({fecha_creado: 'desc'}).exec();
        
        console.log('mvs: ', movimientos);
        res.status(200).json(movimientos)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createMovimientoProveedor = async(req, res) =>{
    
    var movimientoProveedor = req.body;
    
    console.log('Movimiento proveedor desde el controlador: ', movimientoProveedor)
    
    // Si el movimiento tiene importe negativo, se omiten los campos "origen", "cuenta destino" y "comision"
    
    if(movimientoProveedor.importe<=-1){
        movimientoProveedor.origen == null;    
        movimientoProveedor.cuenta_destino == null;    
        movimientoProveedor.comision == null;    
        
    }
    
    var newMovimiento = new Movimiento(movimientoProveedor);
    
    try{

        await newMovimiento.save().then(m => m.populate('proveedor').execPopulate())

        res.status(201).json(newMovimiento)       
        
    }catch(error){
        console.log(error)
        res.status(409).json({message: error.message})
    }
    
}

export const deleteMovimientoProveedor = async (req, res)=>{
    
    console.log('Llegamos al controlador de eliminar movimiento proveedor')
    const id = req.params.id;
    
    console.log('ID: ', id)
    
    await Movimiento.findByIdAndRemove(id)
    
    res.json({message: 'Movimiento proveedor deleted succesfully', id: id})
    
}

export const createMovimientoCaja = async(req, res) =>{
    
    var movimientoCaja = req.body;
    
    var newMovimientoCaja = new MovimientoCaja(movimientoCaja);
    
    try{
        await newMovimientoCaja.save()
        
        res.status(201).json({newMovimientoCaja})
    }catch(error){
        console.log(error)
        res.status(409).json({message: error.message})
    }
    
}

export const getMovimientosCajas = async (req, res)=>{
    try{
        
        const movimientosCajas = await MovimientoCaja.find().sort({fecha_creado: 'desc'});
        
        console.log('mvs: ', movimientosCajas);
        res.status(200).json(movimientosCajas)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const deleteMovimientoCaja = async (req, res)=>{
    
    const id = req.params.id;
    
    console.log('ID: ', id)
    
    await MovimientoCaja.findByIdAndRemove(id)
    
    res.json({message: 'Movimiento proveedor deleted succesfully', id: id})
    
}


export const updateMovimientoProveedor = async (req, res) =>{

    const movimiento = req.body;
    const filter = {_id: movimiento._id}
    console.log('movimiento DESDE SERVER: ', movimiento)


    var movimientoToUpdate = await Movimiento.findOneAndUpdate(filter, movimiento, {new: true}).populate('proveedor').exec()

    console.log('movimiento actualizada desde el controlador: ', movimientoToUpdate)

    try{            
                
        res.status(201).json(movimientoToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}


export const updateMovimientoCaja = async (req, res) =>{

    const movimiento = req.body;
    const filter = {_id: movimiento._id}
    console.log('movimiento DESDE SERVER: ', movimiento)


    var movimientoToUpdate = await MovimientoCaja.findOneAndUpdate(filter, movimiento, {new: true})

    console.log('movimiento actualizado desde el controlador: ', movimientoToUpdate)

    try{            
                
        res.status(201).json(movimientoToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const exportMovimientosCajas = async (req,res) =>{

    // Acá después hay que hacer que reciba un rango de fechas :P
    console.log('Llegamos al controlador exportMovimientosCajas')
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
        console.log('error:', error.message)
        res.status(500).send(error.message)
    }



}