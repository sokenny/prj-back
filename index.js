import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'

import postRoutes from './routes/posts.js'
import userRoutes from './routes/users.js'
import clienteRoutes from './routes/clientes.js'
import operacionesRoutes from './routes/operaciones.js'
import proveedoresRoutes from './routes/proveedores.js'
import cuentasRoutes from './routes/cuentas.js'
import ordenesRoutes from './routes/ordenes.js'
import movimientosRoutes from './routes/movimientos.js'
import globalesRoutes from './routes/globales.js'
import reportesRoutes from './routes/reportes.js'
import cierreRoutes from './routes/cierre.js'
import configRoutes from './routes/config.js'

import { verifyToken } from './auth.js';

const app = express()

// const cors = require('cors');

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
// app.use(cors())
app.use(cors({
    origin: 'https://fervent-lamport-727df5.netlify.app'
}));

// A esta ruta no le pasamos el middleware de verifyToken porque contiene la funcion "login" para la cual no se requiere el token
app.use('/users', userRoutes)
app.use('/posts',   postRoutes)
app.use('/clientes',  clienteRoutes)
app.use('/operaciones',  operacionesRoutes)
app.use('/proveedores',  proveedoresRoutes)
app.use('/cuentas',  cuentasRoutes)
app.use('/ordenes',  ordenesRoutes)
app.use('/movimientos',  movimientosRoutes)
app.use('/globales',  globalesRoutes)
app.use('/reportes',  reportesRoutes)
app.use('/cierre',  cierreRoutes)
app.use('/config', configRoutes)

const CONNECTION_URL = 'mongodb://juanchaher:juanchaher123@cluster0-shard-00-00.67rpn.mongodb.net:27017,cluster0-shard-00-01.67rpn.mongodb.net:27017,cluster0-shard-00-02.67rpn.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-74rwgc-shard-0&authSource=admin&retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> app.listen(PORT, ()=>console.log('Server running on port: ' + PORT)))
    .catch((error)=> console.log(error.message)) 

mongoose.set('useFindAndModify', false)