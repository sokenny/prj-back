import mongoose from 'mongoose'

const cuentaSchema = mongoose.Schema({

    proveedor: { type: mongoose.Schema.Types.ObjectId, ref: 'Proveedores', required: false },
    nombre: String,
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
})

const Cuenta = mongoose.model('Cuentas', cuentaSchema);

export default Cuenta;