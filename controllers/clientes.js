import mongoose from 'mongoose';
import Cliente from '../models/cliente.js';

export const getClientes = async (req, res)=>{
    console.log('controller getClientes')
    try{

        const clientes = await Cliente.find();
        
        console.log('cls: ', clientes);
        res.status(200).json(clientes)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createCliente = async(req, res) =>{

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