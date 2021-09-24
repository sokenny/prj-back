import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const factura = new Schema({
    forma_de_pago: String,
    monto_factura_ars: Number,
    monto_factura_usd: Number,
    monto_factura_ars_comision: Number,
    monto_factura_usd_comision: Number,
    cambio_nuestro: Number,
    cambio_cliente: Number,
    comision: Number,
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },
    
});

const cash = new Schema({
    comision: Number,
    monto_cliente: Number,
    monto_envio: Number,
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },    
});


const tipo_orden = new Schema({
    factura: factura,
    cash: cash    
});

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
    },

    a_entregar: {
        monto: Number,
        divisa: String
    },

    ars: Number,
    usd: Number,

    tipo: String,
    estado: { type: String},

    // Dentro de este objeto, van objetos con los campos propios de cada tipo de orden
    tipo_orden: tipo_orden,
    

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
    fav_status:{
        type: Number,
        default: 0
    },
    fecha_entrega: { 
        type: Date,
        default: null
    },
    fecha_creado: {
        type: Date,
        default: new Date()
    },
    lista: Boolean,
    encargado: String

})

const Orden = mongoose.model('Ordenes', ordenSchema);

export default Orden;