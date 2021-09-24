import mongoose from 'mongoose'



const configSchema = mongoose.Schema({

    categorias_egresos: [String],
    categorias_ingresos: [String],
    categorias_in_cierre: Object,


})

const Config = mongoose.model('Configs', configSchema);

export default Config;