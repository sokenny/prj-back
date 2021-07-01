import mongoose from 'mongoose';
import Movimiento from '../models/movimiento.js';
import MovimientoCaja from '../models/movimiento_caja.js';

export const getMovimientos = async (req, res)=>{
    console.log('controller getMovimientos')
    try{

        const movimientos = await Movimiento.find().populate('proveedor').populate('cuenta_destino').exec();
        
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
        await newMovimiento.save()
        
        res.status(201).json({newMovimiento})
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
        
        const movimientosCajas = await MovimientoCaja.find();
        
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