import mongoose from 'mongoose'

const proveedorSchema = mongoose.Schema({

    nombre: String,
    divisa: String,
    fee: Number,
    cuentas: [String],
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
})

const Proveedor = mongoose.model('Proveedores', proveedorSchema);

export default Proveedor;