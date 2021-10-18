import mongoose from 'mongoose';
import Operacion from '../models/operacion.js';
import Orden from '../models/orden.js';
import MovimientoCaja from '../models/movimiento_caja.js';
import Movimiento from '../models/movimiento.js';
import Cliente from '../models/cliente.js';

export const favRow = async(req, res) =>{

    const data = req.body;
    // const newPost = new PostMessage(post);
    console.log('FAV DESDE CONTROLLER: ', data)

    try{
        if(data.tipo === 'operaciones'){
            await Operacion.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo === 'ordenes' || data.tipo == 'facturas' || data.tipo == 'cash'){
            await Orden.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo === 'clientes'){
            console.log('llegamos al if de clientes :P xd')
            await Cliente.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
        }else if(data.tipo === 'cajas'){
            
            var h = await MovimientoCaja.findByIdAndUpdate(data.id, {fav_status: data.fav_status});
            console.log('h! ', h)
        }
        res.status(201).json()
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const changeEstado = async(req, res) =>{

    const data = req.body;
    // const newPost = new PostMessage(post);
    console.log('ChangeEstado DESDE CONTROLLER: ', data)

    try{
        if(data.tipo == 'operaciones'){
            await Operacion.findByIdAndUpdate(data.row_data._id, {estado: data.value});
        }else if(data.tipo == 'ordenes' || data.tipo == 'ordenes de hoy' || data.tipo == 'operaciones sin órdenes' || data.tipo == 'depositos'){
            // await Operacion.findByIdAndUpdate(data.row_data._id, {estado: data.value});
            console.log(data.value)
            await Orden.findByIdAndUpdate(data.row_data._id, {estado: data.value} );

        }else if(data.tipo == 'clientes'){
            console.log('llegamos al if de clientes :P xd')
            // await Cliente.findByIdAndUpdate(data.row_data._id, {fav_status: data.fav_status});
        }else if(data.tipo == 'facturas' || data.tipo == 'cash'){
            await Orden.findByIdAndUpdate(data.row_data._id, {estado: data.value});
        }else if(data.tipo == 'proveedores'){

            // Actualizamos el estado de la operacion que pueda tener asociada, a "Confirmado"
            await Movimiento.findByIdAndUpdate(data.row_data._id, {estado: data.value})
            if(data.row_data.operacion && data.value === 'Acreditado'){
                await Operacion.findByIdAndUpdate(data .row_data.operacion, {estado: 'Confirmado', corroborar: false})
            }

        }
        res.status(201).json()
    }catch(error){
        res.status(409).json({message: error.message})
    }

}