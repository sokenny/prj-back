import mongoose from 'mongoose'

const historialCambiosSchema = mongoose.Schema({

    cambio: Number,
    dia: {
        type: String,
        default: new Date().toISOString().split('T')[0]
    },
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
})

const HistorialCambios = mongoose.model('HistorialCambios', historialCambiosSchema);

export default HistorialCambios;

