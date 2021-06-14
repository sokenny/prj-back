import mongoose from 'mongoose'

const proveedorSchema = mongoose.Schema({

    nombre: String,
    divisa: String,
    fee: Number,
    cuentas: [String],
    fecha_creado: {
        type: Date,
        default: new Date()
    }

})

const Proveedor = mongoose.model('Proveedores', proveedorSchema);

export default Proveedor;