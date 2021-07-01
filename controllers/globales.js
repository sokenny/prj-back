import mongoose from 'mongoose';
import Operacion from '../models/operacion.js';
import Orden from '../models/orden.js';
import Movimiento from '../models/movimiento.js';
import Cliente from '../models/cliente.js';

export const favRow = async(req, res) =>{

    const data = req.body;
    // const newPost = new PostMessage(post);
    console.log('FAV DESDE CONTROLLER: ', data)

    try{
        if(data.tipo == 'operaciones'){
            await Operacion.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo == 'ordenes'){
            await Orden.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo == 'clientes'){
            console.log('llegamos al if de clientes :P xd')
            await Cliente.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }
        res.status(201).json()
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const changeEstado = async(req, res) =>{

    const data = req.body;
    // const newPost = new PostMessage(post);
    console.log('FAV DESDE CONTROLLER: ', data)

    try{
        if(data.tipo == 'operaciones'){
            console.log('Llegamos al controlador de operaciones')
            await Operacion.findByIdAndUpdate(data.id, {estado: data.value});
        }else if(data.tipo == 'ordenes'){
            // await Orden.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo == 'clientes'){
            console.log('llegamos al if de clientes :P xd')
            // await Cliente.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }
        res.status(201).json()
    }catch(error){
        res.status(409).json({message: error.message})
    }

}