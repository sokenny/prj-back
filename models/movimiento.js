import mongoose from 'mongoose'

const movimientoSchema = mongoose.Schema({

    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },
    cuenta_destino: { type: mongoose.Schema.Types.ObjectId, ref: 'Cuentas', required: false },
    operacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Operaciones', required: false },
    importe: Number,
    origen: String,
    comision:Number,
    estado: String,
    nota: String,
    operador: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    fecha_creado: {
        type: Date,
        default: new Date()
    }

})

const Movimiento = mongoose.model('Movimientos', movimientoSchema);

export default Movimiento;