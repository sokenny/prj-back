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
    let configUpdate = await Config.findOneAndUpdate({}, config, {new: true})

    try{                            
        res.status(201).json(configUpdate)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const getCambioDia = async (req, res, return_res=true) => {

    let new_date = new Date();
    new_date.setDate(new_date.getDate()-1)
    const AYER_STRING = new_date.toISOString().split('T')[0]
    const AYER_00 = new Date(AYER_STRING)
    const AYER_21HS = new Date(new Date().toISOString().split('T')[0])
    
    const cambios_compra_ayer_y_hoy = await Operacion.find({tipo_operacion: 'Cambio', tipo_cambio: 'Compra', fecha_creado:{$gte: AYER_STRING}})
    const cambios_compra_hoy = cambios_compra_ayer_y_hoy.filter((cambio)=>cambio.fecha_creado > AYER_21HS)
    const cambios_compra_ayer = cambios_compra_ayer_y_hoy.filter((cambio)=>cambio.fecha_creado > AYER_00 && cambio.fecha_creado < AYER_21HS)

    let cambios_compra_pendientes = cambios_compra_ayer.filter(cambio => (cambio.estado === "Pendiente" ))
    const ars_ayer = cambios_compra_pendientes.reduce((total_ars, cambio) => total_ars + cambio.monto_enviado, 0)
    
    let ultimo_cambio_registrado = await HistorialCambios.findOne().sort({fecha_creado: 'desc'}).exec()
    ultimo_cambio_registrado = parseFloat(ultimo_cambio_registrado?.cambio.toFixed(2))

    const usd_hoy = cambios_compra_hoy.filter(cambio => cambio.tipo_cambio == "Compra")   
    
    const cambio_usd_suma = usd_hoy.reduce((cambio_usd_suma, usd) => cambio_usd_suma + (usd.monto_enviado/usd.cambio_cliente), 0);
    const cambio_ars_suma = usd_hoy.reduce((cambio_ars_suma, usd) => cambio_ars_suma + usd.monto_enviado, 0);

    function calculateCambio(){
        return parseFloat(((cambio_ars_suma + ars_ayer) / (cambio_usd_suma + ( ars_ayer / ultimo_cambio_registrado) )).toFixed(2));
    }
        
    const cambio = calculateCambio()
    var cambio_to_return = cambio

    // Si hoy no hay cambios, devolvemos el cambio de ayer
    if(cambio_usd_suma === 0 && cambio_ars_suma === 0){
        cambio_to_return = ultimo_cambio_registrado
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

    const cambio = await getCambioDia(req, res, false)

    let historial_cambios_item = {cambio, dia: new Date().toISOString().split('T')[0]}
    var message = "";

    const cambio_registrado_hoy = await HistorialCambios.find({dia: new Date().toISOString().split('T')[0]})
    if(cambio_registrado_hoy.length < 1){
        const nuevo_cambio_a_registrar = new HistorialCambios(historial_cambios_item)
        await nuevo_cambio_a_registrar.save()
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
    let historial_cambios = await HistorialCambios.find().limit(data.limit).sort({fecha_creado: 'desc'});

    try{                            
        res.status(201).json(historial_cambios)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}