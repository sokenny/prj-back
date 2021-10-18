import mongoose from 'mongoose';
import Config from '../models/config.js';
import Operacion from '../models/operacion.js';
import HistorialCambios from '../models/historial_cambios.js';


export const getConfig = async (req, res) =>{

    try{
        var config = await Config.find().exec()
        res.status(200).json(config[0])
    }catch(error){
        res.status(404).json({message: error.message})
    }

}

export const updateConfig = async (req, res) =>{

    const config = req.body;
    console.log('llega: ', config)
    let configUpdate = await Config.findOneAndUpdate({}, config, {new: true})

    console.log('updateado: ', configUpdate)

    try{                            
        res.status(201).json(configUpdate)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const getCambioDia = async (req, res, return_res=true) => {

    let cambios = await Operacion.find({tipo_operacion: 'Cambio', tipo_cambio: 'Compra', fecha_creado:{$gte: '2021-01-14',$lt: '2021-11-25'}})
    cambios = []

    let ayer_00 = new Date();
    ayer_00.setDate(ayer_00.getDate()-1)
    let ayer_string = ayer_00.toISOString().split('T')[0]
    ayer_00 = new Date(ayer_string)

    let ars_ayer = cambios.filter(cambio => (cambio.fecha_creado >  ayer_00 && cambio.fecha_creado < new Date(new Date().toISOString().split('T')[0]) && cambio.estado === "Pendiente" ))
    ars_ayer = ars_ayer.reduce((total_ars, cambio) => total_ars + cambio.monto_enviado, 0)
    
    // Consultamos cambio de ayer
    let historial_cambios = await HistorialCambios.find({dia: ayer_string})
    let cambio_ayer = parseFloat(historial_cambios[0].cambio.toFixed(2))


    let cambios_hoy = cambios
    let usd_hoy = cambios_hoy.filter(cambio => cambio.tipo_cambio == "Compra")   
    
    const cambio_usd_suma = usd_hoy.reduce((cambio_usd_suma, usd) => cambio_usd_suma + (usd.monto_enviado/usd.cambio_cliente), 0);

    const cambio_ars_suma = usd_hoy.reduce((cambio_ars_suma, usd) => cambio_ars_suma + usd.monto_enviado, 0);
        
    let cambio = parseFloat(((cambio_ars_suma + ars_ayer) / (cambio_usd_suma + ( ars_ayer / cambio_ayer) )).toFixed(2));

    var cambio_to_return = cambio

    // Si hoy no hay cambios, devolvemos el cambio de ayer
    if(cambios.length<1){

        console.log('no hay cambios apara hoy', cambio_ayer)
        cambio_to_return = cambio_ayer
    
    }


    if(return_res){  
        try{                            
            res.status(201).json(cambio_to_return)
        }catch(error){
            res.status(409).json({message: error.message})
        }
    }

    return cambio_to_return

}

export const setCambioDia = async (req, res) => {

    let cambio = await getCambioDia(req, res, false)

    let historial_cambios_item = {cambio, dia: new Date().toISOString().split('T')[0]}
    var message = "";

    let this_day = await HistorialCambios.find({dia: new Date().toISOString().split('T')[0]})
    if(this_day.length < 1){
        var new_cambio = new HistorialCambios(historial_cambios_item)
        await new_cambio.save()
        message = "Cambio insertado con éxito."
    }else{
        message = "Ya existe un registro de cambio con la fecha de hoy."
    }

    try{                            
        res.status(201).json({cambio, message})
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const getHistorialCambios = async (req, res) => {

    const data = req.params

    console.log('data que llega: ', data)

    let historial_cambios = await HistorialCambios.find().limit(data.limit).sort({fecha_creado: 'desc'});

    console.log('historial cambios: ', historial_cambios)

    try{                            
        res.status(201).json(historial_cambios)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}