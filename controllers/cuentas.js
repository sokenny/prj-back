import Cuenta from '../models/cuenta.js';

export const getCuentas = async (req, res)=>{
    try{

        const cuentas = await Cuenta.find().populate('proveedor').sort({fecha_creado: 'desc'}).exec();
        
        res.status(200).json(cuentas)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const createCuenta = async(req, res) =>{

    const cuenta = req.body;
    const newCuenta = new Cuenta(cuenta);

    try{
        await newCuenta.save();
        res.status(201).json(newCuenta)
    }catch(error){
        res.status(409).json({message: error.message})
    }

}