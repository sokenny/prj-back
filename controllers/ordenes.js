import mongoose from 'mongoose';
import Orden from '../models/orden.js';

export const getOrdenes = async (req, res)=>{
    console.log('controller getOrdenes', req)
    try{
        
        var ordenes = await Orden.find().populate('cliente').exec()
        
        console.log('ordenes: ', ordenes);
        res.status(200).json(ordenes)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const getOrdenesHoy = async (req, res)=>{
}



// export const createOrden = async(req, res) =>{

//     const operacion = req.body.operacionData;
//     const ordenes = req.body.ordenes;
//     const newOperacion = new Operacion(operacion);

//     console.log('REQBODY DESDE SERVER: ', req.body)

//     try{
//         await newOperacion.save().then(() => {
            
//             // Creamos las ordenes
//             for (let i = 0; i < ordenes.length; i++) {
                    
//                     var orden = ordenes[i];
//                     orden.operacion = newOperacion._id
//                     var newOrden = new Orden(orden)
                    
//                     console.log('Orduin: ', orden)
                    
//                     try{
//                         newOrden.save()
//                     }catch(error){
//                         console.log('error al crear orden: ', error)
//                     }
                    
//             }
            

//         });
//         res.status(201).json({newOperacion, ordenes})
//     }catch(error){
//         res.status(409).json({message: error.message})
//     }

// }

export const createOrdenSolo = async (req, res) =>{

    const ordenes = req.body;
    console.log('REQBODY DESDE SERVER: ', ordenes)

    
    try{            
        // Creamos las ordenes
        for (let i = 0; i < ordenes.length; i++) {
                var orden = ordenes[i];
                // orden.operacion = newOperacion._id

                var newOrden = new Orden(orden)
                console.log('Orduin: ', orden)
                
                try{
                    newOrden.save()
                }catch(error){
                    console.log('error al crear orden: ', error)
                }
            }

            res.status(201).json(newOrden)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const deleteOrden = async (req, res)=>{
    
    console.log('Llegamos al controlador de eliminar orden')
    const id = req.params.id;

    console.log('ID: ', id)

    await Orden.findByIdAndRemove(id)
    
    res.json({message: 'Orden deleted succesfully', id: id})

}