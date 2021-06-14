import mongoose from 'mongoose';
import Movimiento from '../models/movimiento.js';

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
