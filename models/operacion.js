import mongoose from 'mongoose'

const operacionSchema = mongoose.Schema({

    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Clientes', required: false },
    cliente_borrador: String,
    tipo_operacion: String,
    tipo_envia: String,
    operacion_crypto: String,
    tipo_cambio: String,
    monto_enviado: Number,
    cambio_prj: Number,
    cambio_cliente: Number,
    cuenta_origen: String,
    fee_plataforma: Number,
    monto_llega: Number,
    tipo_recibe: String,
    cliente_recibe: { type: mongoose.Schema.Types.ObjectId, ref: 'Clientes', required: false },
    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },
    cuenta_destino: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuentas', required: false },
    comision_proveedor: Number,
    comision_prj: Number,
    monto_a_entregar: Number,
    fav_status:{
        type: Number,
        default: 0
    },
    // ordenes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ordenes', required: true }],
    cambio_cliente: Number,
    ganancia_prj : Number,
    spread: Number,
    estado: String,
    nota: String,
    fecha_creado: {
        type: Date,
        default: new Date()
    }

})

const Operacion = mongoose.model('Operaciones', operacionSchema);

export default Operacion;