import mongoose from 'mongoose';
import Operacion from '../models/operacion.js';
import Orden from '../models/orden.js';
import Movimiento from '../models/movimiento.js';

export const getOperaciones = async (req, res)=>{
    console.log('llegamos al controlador de operaciones')
    try{

        var operaciones = await Operacion.find().populate('cliente').populate('proveedor').populate('cuenta_destino').exec()
        

        console.log('ops', operaciones);
        res.status(200).json(operaciones)
        
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const getClienteOperaciones = async (req, res)=>{

    const {id} = req.params;

    try{
        const clienteOperaciones = await Operacion.find({id_cliente: id});
        
        console.log(clienteOperaciones);
        res.status(200).json(clienteOperaciones)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}


export const createOperacion = async(req, res) =>{

    const operacion = req.body.operacionData;
    const ordenes = req.body.entregas;
    const newOperacion = new Operacion(operacion);

    console.log('REQBODY DESDE SERVER: ', req.body)

    try{
        await newOperacion.save().then(() => {
            
            // Creamos las ordenes
            for (let i = 0; i < ordenes.length; i++) {
                    
                    var orden = ordenes[i];
                    // orden.fecha_entrega = new Date(orden.fecha_entrega)
                    console.log('lafechaentrega: ', orden.fecha_entrega)
                    orden.operacion = newOperacion._id
                    var newOrden = new Orden(orden)
                    
                    console.log('Orduin: ', orden)
                    
                    try{
                        newOrden.save()
                    }catch(error){
                        console.log('error al crear orden: ', error)
                    }
                    
            }

            if(newOperacion.tipo_operacion == 'Bajada'){
                
                // Si la operacion era de tipo Bajada y tipo_recibe Cliente, creamos la subida para ese cliente.
                if(newOperacion.tipo_recibe == 'Cliente'){
                    console.log('Creamos una subida!')
                    
                    const operacionSubida = {cliente:newOperacion.cliente_recibe, monto_enviado: newOperacion.monto_llega, tipo_operacion: 'Subida', estado:'Pendiente'}
                    const newOperacionSubida = new Operacion(operacionSubida);
                    try{
                        newOperacionSubida.save()
                    }catch(error){
                        console.log('error al crear operacion subida: ', error)
                    }

                // Si la operacion de tipo Bajada la recibe un proveedor, creamos el movimiento
                }else if(newOperacion.tipo_recibe == 'Proveedor'){

                    const movimiento = {proveedor: newOperacion.proveedor, cuenta_destino: newOperacion.cuenta_destino, importe: newOperacion.monto_llega, origen: newOperacion.cuenta_origen + ' ('+newOperacion.tipo_operacion+')', comision: newOperacion.comision_proveedor, estado: 'Enviado'}
                    const newMovimiento = new Movimiento(movimiento);
                    try{
                        newMovimiento.save();
                    }catch(error){
                        console.log('Error al crear movimiento : ', error)
                    }

                }

            }
            

        });
        res.status(201).json({newOperacion, ordenes})
    }catch(error){
        console.log('errorsete: ', error)
        res.status(409).json({message: error.message})
    }

}


export const deleteOperacion = async (req, res)=>{
    
    console.log('Llegamos al controlador de eliminar operacion')
    const id = req.params.id;

    console.log('ID: ', id)

    await Operacion.findByIdAndRemove(id)
    
    res.json({message: 'Operacion deleted succesfully', id: id})

}