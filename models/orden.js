import mongoose from 'mongoose'

const ordenSchema = mongoose.Schema({

    // operacion: { 
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Operaciones',
    //     required: true 
    // },
    // divisa: String,
    // tipo: String,
    // monto: Number,
    // estado: String,
    // localidad: String,
    // domicilio: String,
    // provincia: String,
    // banco: String,
    // nro_cuenta: Number,
    // titular: String,
    // tipo_cuenta: String,
    // cbu: Number,
    // alias: String,
    // fecha_creado: {
    //     type: Date,
    //     default: new Date()
    // }


    operacion: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operaciones',
        default: null
    },
    cliente : { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clientes',
        required: true 
    },

    a_entregar: {
        monto: Number,
        divisa: String
    },

    ars: Number,
    usd: Number,

    tipo: String,
    estado: Number,

    // envio:{
        encargado: String,
        provincia: String,
        localidad: { 
            type: String,
            default: ''
        },
        direccion: String,
        cp : String,
        depto: String,
    // },

    // banco:{
        banco: String,
        nro_cuenta: Number,
        titular: String,
        tipo_cuenta: String,
        cbu: Number,
        alias: String,
    // },
    nota: String,
    fecha_entrega: { 
        type: Date,
        default: null
    },
    fecha_creado: {
        type: Date,
        default: new Date()
    },
    encargado: String

})

const Orden = mongoose.model('Ordenes', ordenSchema);

export default Orden;