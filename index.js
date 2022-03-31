import express from 'express';
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import cors from 'cors'
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
import registroBalances from './routes/balances.js';
import { verifyToken } from './auth.js';

const app = express()

process.env.TZ = "America/Argentina/Buenos_Aires";

app.use(bodyParser.json({limit: "30mb", extended: true}))
app.use(bodyParser.urlencoded({limit: "30mb", extended: true}))
app.use(cors({
    origin: 'https://prj-software.herokuapp.com'
}));

app.use('/users', userRoutes)
app.use('/clientes',  clienteRoutes)
app.use('/operaciones', verifyToken, operacionesRoutes)
app.use('/proveedores', verifyToken, proveedoresRoutes)
app.use('/cuentas', verifyToken, cuentasRoutes)
app.use('/ordenes', verifyToken, ordenesRoutes)
app.use('/movimientos',  movimientosRoutes)
app.use('/globales', verifyToken, globalesRoutes)
app.use('/reportes', reportesRoutes)
app.use('/cierre', verifyToken, cierreRoutes)
app.use('/config', configRoutes)
app.use('/balances', registroBalances)

const CONNECTION_URL = 'mongodb://juanchaher:juanchaher123@cluster0-shard-00-00.67rpn.mongodb.net:27017,cluster0-shard-00-01.67rpn.mongodb.net:27017,cluster0-shard-00-02.67rpn.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-74rwgc-shard-0&authSource=admin&retryWrites=true&w=majority'
const PORT = process.env.PORT || 5000

mongoose.connect(CONNECTION_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=> app.listen(PORT, ()=>console.log('Server running on port: ' + PORT)))
    .catch((error)=> console.log(error.message)) 

mongoose.set('useFindAndModify', false)