import mongoose from 'mongoose'

const movimientoCajaSchema = mongoose.Schema({
    importe: Number,
    descripcion: String,
    categoria: String,
    tipo: {type: Number, min: 0, max: 1},
    caja:String,
    oficina:String,
    fav_status:{
        type: Number,
        default: 0
    },
    operacion: { type: mongoose.Schema.Types.ObjectId, ref: 'Operaciones', required: false },
    orden: { type: mongoose.Schema.Types.ObjectId, ref: 'Ordenes', required: false },
    operador: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: false },
    binded_orden: { type: mongoose.Schema.Types.ObjectId, ref: 'Ordenes', required: false },
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
})

const MovimientoCaja = mongoose.model('MovimientosCajas', movimientoCajaSchema);

export default MovimientoCaja;