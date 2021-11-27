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
const cripto = new Schema({
    comision: Number,
    wallet: String,
    usdt_a_enviar: {
        type: Number,
        default: 0
    }    
});
const saldo = new Schema({
    monto: Number
});
const deposito = new Schema({
    banco: String,
    nro_cuenta: Number,
    titular: String,
    tipo_cuenta: String,
    cbu: Number,
    alias: String,
});
const transferencia = new Schema({
    banco: String,
    nro_cuenta: Number,
    titular: String,
    tipo_cuenta: String,
    cbu: Number,
    alias: String,
});
const moto = new Schema({
    // encargado: String,
    provincia: String,
    localidad: { 
        type: String,
        default: ''
    },
    direccion: String,
    cp : { 
        type: String,
        default: ''
    },
    depto: String,
});



const tipo_orden = new Schema({
    factura: factura,
    cash: cash,
    cripto: cripto,
    saldo : saldo,
    deposito: deposito,
    moto: moto,
    transferencia : transferencia
});

const ordenSchema = mongoose.Schema({


    operacion: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operaciones',
        default: null
    },

    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Clientes', required: false },
    cliente_borrador: String,
    cliente_nombre: String,

    a_entregar: {
        monto: Number,
        divisa: String
    },

    ars: Number,
    usd: Number,

    tipo: String,
    oficina: String,
    estado: { 
        type: String,
        default: 'Pendiente'
    },
    
    // Dentro de este objeto, van objetos con los campos propios de cada tipo de orden
    tipo_orden: tipo_orden,

    nota: String,
    fav_status:{
        type: Number,
        default: 0
    },
    fecha_entrega: { 
        type: Date,
        default: null
    },
    operador: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    fecha_creado: {
        type: Date,
        default: new Date()
    },
    lista: Boolean,
    encargado: String

})

const Orden = mongoose.model('Ordenes', ordenSchema);

export default Orden;