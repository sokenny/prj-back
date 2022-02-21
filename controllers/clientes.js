import Cliente from '../models/cliente.js';
import Orden from '../models/orden.js';
import Operacion from '../models/operacion.js';


export const getClientes = async (req, res)=>{
    
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
    
    const id = req.params.id;
    await Cliente.findByIdAndRemove(id)
    res.json({message: 'Cliente deleted succesfully', id: id})

}

export const updateCliente = async (req, res) =>{

    const cliente = req.body;
    const filter = {_id: cliente._id}
    var clienteToUpdate = await Cliente.findOneAndUpdate(filter, cliente, {new: true})

    try{                            
        res.status(201).json(clienteToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }

}

export const getSaldoCliente = async (req, res) => {
    let ordenesCliente = await getOrdenesCliente(req, res, )
    
    let reducer = (a, b) => {
        if(typeof b.usd !== "number"){ b.usd = 0 }
        if(typeof a.usd !== "number"){ a.usd = 0 }
        return { usd: a.usd + b.usd }
    }
    let montoRecibo = ordenesCliente.filter((orden)=> orden.recibo).reduce(reducer).usd
    let montoNoRecibo = ordenesCliente.filter((orden)=> !orden.recibo).reduce(reducer).usd
    const SALDO_CLIENTE = montoRecibo - montoNoRecibo
}

export const getOrdenesCliente = async (req, res, return_res=true) => {
    const id = req.params.id;
    var susOperaciones = await Operacion.find({cliente: id}).select("_id")
    
    susOperaciones = susOperaciones.map((operacion)=> `${operacion._id}`)
    
    // var susOrdenes = await Orden.find({ operacion: { $in: susOperaciones }})

    var susOrdenes = await Orden.find({ operacion: { $in: susOperaciones }}).populate({
        path: 'operacion',
        model: 'Operaciones',
        populate:{
            path:'cliente',
            model: 'Clientes'
        }
        }).populate('operador').sort({fecha_creado: 'desc'}).exec()



    if(return_res){
        return susOrdenes
    }else{
        res.status(201).json(susOrdenes)
    }
}
