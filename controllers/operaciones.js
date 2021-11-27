import Operacion from '../models/operacion.js';
import Orden from '../models/orden.js';
import Movimiento from '../models/movimiento.js';

export const getOperaciones = async (req, res)=>{
    const query = req.query
    const periodo = JSON.parse(query.periodo)
    var tipo =  query.tipo;
    if(query.tipo === ''){
        tipo = {
            $exists: true
            }
    }
    try{
        var operaciones = await Operacion.find({
                                                tipo_operacion: tipo,
                                                fecha_creado:{
                                                    $gte: periodo.from,
                                                    $lt: periodo.to
                                                }
                                            }).populate('cliente').populate('proveedor').populate('cuenta_destino').populate('operador').sort({fecha_creado: 'desc'}).exec()


        res.status(200).json(operaciones)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const hasOrden = async (req, res)=>{
    const id = req.params.id;
    try{
        var ordenesAsociadas = await Orden.find({
                                                operacion: id,
                                            }).exec()
        if(ordenesAsociadas.length>0){
            res.status(200).json({error: 0, hasOrden: true})
        }else{
            res.status(200).json({error: 0, hasOrden: false})
        }       
    }catch(error){
        res.status(404).json({message: error.message})
    }
}

export const getClienteOperaciones = async (req, res)=>{
    const {id} = req.params;
    try{
        const clienteOperaciones = await Operacion.find({id_cliente: id}).sort({fecha_creado: 'desc'}).exec();
        
        res.status(200).json(clienteOperaciones)
    }catch(error){
        res.status(404).json({message: error.message})
    }
}


export const createOperacion = async(req, res) =>{
    req.body.operacionData.operador = req.operador
    let operacion = req.body.operacionData;
    for(let key of Object.keys(operacion)){
        if(operacion[key] === ""){
            operacion[key] = null
        }
    }   
    const newOperacion = new Operacion(operacion);
    try{
        await newOperacion.save().then(o => o.populate('cliente').execPopulate()).then(async () => {
            
            if(newOperacion.tipo_operacion == 'Bajada'){
                
                // Si la operacion era de tipo Bajada y tipo_recibe Cliente, creamos la subida para ese cliente.
                if(newOperacion.tipo_recibe == 'Cliente'){ 
                    const operacionSubida = {cliente:newOperacion.cliente_recibe, monto_enviado: newOperacion.monto_llega, tipo_operacion: 'Subida', estado:'Pendiente'}
                    const newOperacionSubida = new Operacion(operacionSubida);
                    try{
                        newOperacionSubida.save().then(o => o.populate('cliente').execPopulate())
                    }catch(error){
                        console.log('error al crear operacion subida: ', error)
                    }

                // Si la operacion de tipo Bajada la recibe un proveedor, creamos el movimiento
                }else if(newOperacion.tipo_recibe == 'Proveedor'){

                    const movimiento = {proveedor: newOperacion.proveedor, cuenta_destino: newOperacion.cuenta_destino, operacion: newOperacion._id, importe: newOperacion.monto_llega, origen: newOperacion.cuenta_origen + ' ('+newOperacion.tipo_operacion+')', comision: newOperacion.comision_proveedor, estado: 'Enviado'}
                    const newMovimiento = new Movimiento(movimiento);
                    try{
                        newMovimiento.save();
                    }catch(error){
                        console.log('Error al crear movimiento : ', error)
                    }
                }

                // Si tenía "transferencia" como forma de pago, creamos un movimiento al proveedor asociado a esa transferencia
                if(operacion.recibe_transferencia){
                    let proveedor_transferencia = JSON.parse(operacion.proveedor_transferencia)
                    let importe;
                    // Por ahora hardcodeamos cambio proveedor hasta definir si es algo que se configura dentro del proveedor
                    let cambio_proveedor = 150;
                    proveedor_transferencia.divisa === 'ARS' ? importe = -Math.round(operacion.monto_a_entregar * cambio_proveedor) : importe = -operacion.monto_a_entregar
                    
                    let movimientoProveedor = {proveedor: proveedor_transferencia._id, importe, estado: 'Enviado', comision: 0}
                    const newMovimiento = new Movimiento(movimientoProveedor);
                    try{
                        newMovimiento.save().then(()=>console.log('Movimiento proveedor creado con exito.'));
                    }catch(error){
                        console.log('Error al crear movimiento : ', error)
                    }
                }

            }
    
        });
        res.status(201).json({newOperacion})
    }catch(error){
        res.status(409).json({message: error.message})
    }

}


export const deleteOperacion = async (req, res)=>{
    const id = req.params.id;
    await Operacion.findByIdAndRemove(id)
    res.json({message: 'Operacion deleted succesfully', id: id})
}

export const updateBajada = async (req, res) =>{
    const bajada = req.body;
    const filter = {_id: bajada._id}
    var bajadaToUpdate = await Operacion.findOneAndUpdate(filter, bajada, {new: true}).populate('proveedor').populate('cuenta_destino').populate('cliente').exec()
    try{            
                
        res.status(201).json(bajadaToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateSubida = async (req, res) =>{
    const subida = req.body;
    const filter = {_id: subida._id}
    var subidaToUpdate = await Operacion.findOneAndUpdate(filter, subida, {new: true}).populate('proveedor').populate('cuenta_destino').populate('cliente').exec()
    try{                
        res.status(201).json(subidaToUpdate)
            
    }catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateCrypto = async (req, res) =>{
    const crypto = req.body;
    const filter = {_id: crypto._id}
    var cryptoToUpdate = await Operacion.findOneAndUpdate(filter, crypto, {new: true}).populate('proveedor').populate('cuenta_destino').populate('cliente').exec()
    try{            
        res.status(201).json(cryptoToUpdate)
    }catch(error){
        res.status(409).json({message: error.message})
    }
}

export const updateCambio = async (req, res) =>{
    const cambio = req.body;
    const filter = {_id: cambio._id}
    var cambioToUpdate = await Operacion.findOneAndUpdate(filter, cambio, {new: true}).populate('proveedor').populate('cuenta_destino').populate('cliente').exec()
    try{            
        res.status(201).json(cambioToUpdate)
    }catch(error){
        res.status(409).json({message: error.message})
    }
}