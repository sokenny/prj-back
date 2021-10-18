import mongoose from 'mongoose';
import Cliente from '../models/cliente.js';


export const getClientes = async (req, res)=>{
    console.log('controller getClientes')
    
    const query = req.query
    const periodo = JSON.parse(query.periodo)
    var tipo =  query.tipo;
    if(query.tipo === ''){
        tipo = {
            $exists: true
        }
    }
    
    try{
        const clientes = await Cliente.find({
                                            origen: tipo,
                                            fecha_creado:{
                                                $gte: periodo.from,
                                                $lt: periodo.to
                                            }
                                        }).sort({fecha_creado: 'desc'});
                                        
        res.status(200).json(clientes)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createCliente = async(req, res) =>{
    req.body.clienteData.operador = req.operador
    const cliente = req.body.clienteData;
    const newCliente = new Cliente(cliente);

    try{
        await newCliente.save();
        res.status(201).json(newCliente)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const deleteCliente = async (req, res)=>{
    
    console.log('Llegamos al controlador de eliminar cliente')
    const id = req.params.id;

    console.log('ID: ', id)

    await Cliente.findByIdAndRemove(id)
    
    res.json({message: 'Cliente deleted succesfully', id: id})

}

export const updateCliente = async (req, res) =>{

    const cliente = req.body;
    const filter = {_id: cliente._id}
    console.log('cliente DESDE SERVER: ', cliente)


    var clienteToUpdate = await Cliente.findOneAndUpdate(filter, cliente, {new: true})

    console.log('cliente actualizada desde el controlador: ', clienteToUpdate)

    try{            
                
        res.status(201).json(clienteToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}