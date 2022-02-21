import mongoose from 'mongoose'

const operacionSchema = mongoose.Schema({
    cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Clientes', required: false },
    cliente_borrador: String,
    proveedor_as_cliente: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },
    tipo_operacion: String,
    tipo_envia: String,
    corroborar: {type: Boolean, default: false},
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
    comision_proveedor_cantidad: Number,
    comision_prj: Number,
    comision_prj_cantidad: Number,
    monto_a_entregar: Number,
    fav_status:{
        type: Number,
        default: 0
    },
    ganancia_prj : Number,
    spread: Number,
    estado: String,
    nota: String,
    como_recibe: String,
    fecha_entrega: {
        type: String,
        default: null
    },
    oficina: String,
    operador: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    fecha_recibe: String,
    oficina : String,
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
})

const Operacion = mongoose.model('Operaciones', operacionSchema);

export default Operacion;