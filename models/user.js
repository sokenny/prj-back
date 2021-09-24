import mongoose from 'mongoose'

const userSchema = mongoose.Schema({

    mail: String,
    name: String,
    password: String,
    level: Number,
    fecha_creado: {
        type: Date,
        default: new Date()
    }

})

const User = mongoose.model('Users', userSchema);

export default User;