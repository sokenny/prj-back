import mongoose from 'mongoose'

const historialCambiosSchema = mongoose.Schema({

    cambio: Number,
    dia: {
        type: String,
        default: new Date().toISOString().split('T')[0]
    },
    fecha_creado: {
        type: Date,
        default: new Date()
    }

})

const HistorialCambios = mongoose.model('HistorialCambios', historialCambiosSchema);

export default HistorialCambios;

