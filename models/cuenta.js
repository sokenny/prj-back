import mongoose from 'mongoose'

const cuentaSchema = mongoose.Schema({

    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },
    nombre: String,
    fecha_creado: {
        type: Date,
        default: new Date()
    }

})

const Cuenta = mongoose.model('Cuentas', cuentaSchema);

export default Cuenta;