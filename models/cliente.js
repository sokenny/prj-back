import mongoose from 'mongoose'

const clienteSchema = mongoose.Schema({

    nombre: String,
    telefono: Number,
    origen: String,
    domicilio: String,
    localidad: String,
    provincia: String,
    banco: String,
    nro_cuenta: Number,
    tipo_cuenta: String,
    cbu: Number,
    alias: String,
    fav_status:{
        type: Number,
        default: 0
    },
    operador: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
}
)

const Cliente = mongoose.model('Clientes', clienteSchema);

export default Cliente;