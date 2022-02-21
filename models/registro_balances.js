import mongoose from 'mongoose'

const registroBalancesSchema = mongoose.Schema({
    registrado_hasta: String,
    nombre: String,
    balances: Object
},
{
    timestamps: { createdAt: 'fecha_creado', updatedAt: 'fecha_actualizado' }
})

const RegistroBalances = mongoose.model('RegistroBalances', registroBalancesSchema);

export default RegistroBalances;