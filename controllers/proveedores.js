import mongoose from 'mongoose';
import Proveedor from '../models/proveedor.js';
import Cuenta from '../models/cuenta.js';

export const getProveedores = async (req, res)=>{
    try{
        const proveedores = await Proveedor.find();
        
        console.log('ops', proveedores);
        res.status(200).json(proveedores)
        
    }catch(error){
        res.status(404).json({message: error.message})
    }
}


export const createProveedor = async(req, res) =>{

    const proveedor = req.body.proveedorData;
    const cuentas = req.body.cuentas;
    const newProveedor = new Proveedor(proveedor);

    try{
        await newProveedor.save().then(() => {

            // Creamos las cuentas
            for (let i = 0; i < cuentas.length; i++) {
                    
                var cuenta = cuentas[i];
                cuenta.proveedor = newProveedor._id
                var newCuenta = new Cuenta(cuenta)
                
                console.log('Cuenta: ', cuenta)
                
                try{
                    newCuenta.save()
                }catch(error){
                    console.log('error al crear cuenta: ', error)
                }
                
        }

        })

        res.status(201).json(newProveedor, cuentas)
    }catch(error){
        console.log(error)
        res.status(409).json({message: error.message})
    }

}