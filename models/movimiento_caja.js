import mongoose from 'mongoose'

const movimientoCajaSchema = mongoose.Schema({

    importe: Number,
    descripcion: String,
    categoria: String,
    tipo: {type: Number, min: 0, max: 1},
    caja:String,
    fecha_creado: {
        type: Date,
        default: new Date()
    }

})

const MovimientoCaja = mongoose.model('MovimientosCajas', movimientoCajaSchema);

export default MovimientoCaja;