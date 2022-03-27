import mongoose from 'mongoose'
var Schema = mongoose.Schema;

const factura = new Schema({
    forma_de_pago: String,
    tipo_factura: String,
    monto_factura_ars: Number,
    monto_factura_usd: Number,
    monto_factura_ars_comision: Number,
    monto_factura_usd_comision: Number,
    cambio_nuestro: Number,
    cambio_cliente: Number,
    comision: Number,
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },
    cuenta_destino: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuentas', required: false }
});
const cash = new Schema({
    comision: Number,
    monto_cliente: Number,
    monto_envio: Number,
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },
    cuenta_destino: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuentas', required: false }
});
const crypto = new Schema({
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
    factura,
    cash,
    crypto,
    saldo,
    deposito,
    moto,
    transferencia,
});

const ordenSchema = mongoose.Schema({
    operacion: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Operaciones',
        required: true
    },
    a_entregar: {
        monto: Number,
        divisa: String
    },
    ars: Number,
    usd: Number,
    tipo: String,
    oficina: String,
    cambio_operacion: Number,
    estado: { 
        type: String,
        default: 'Pendiente'
    },
    // Dentro de este objeto, van objetos con los campos propios de cada tipo de orden
    tipo_orden: tipo_orden,
    recibe_cliente:{
        type: Boolean,
        default: false
    },
    nota: String,
    fav_status:{
        type: Number,
        default: 0
    },
    recibo: {
        type: Boolean,
        default: false
    },
    fecha_entrega: { 
        type: String,
        default: null
    },
    operador: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedor', required: false, default: null },
    lista: Boolean,
    encargado: String
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
})

const Orden = mongoose.model('Ordenes', ordenSchema);

export default Orden;