import mongoose from 'mongoose'

const clienteSchema = mongoose.Schema({

    nombre: String,
    telefono: Number,
    origen: String,
    domicilio: String,
    localidad: String,
    provincia: String,
    banco: String,
    nro_cuenta: Number,
    tipo_cuenta: String,
    cbu: Number,
    alias: String,
    fav_status:{
        type: Number,
        default: 0
    },
    operador: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    fecha_creado: {
        type: Date,
        default: new Date()
    },
    saldo : Array
    // [
    //     { 
    //         operacion : {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: 'Operacion',
    //             required: false 
    //         },
    //         monto : Number
    //     }
    // ] 


})

const Cliente = mongoose.model('Clientes', clienteSchema);

export default Cliente;