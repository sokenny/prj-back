import express from 'express'

import { getMovimientos, getMovimientosCajas, createMovimientoProveedor, deleteMovimientoProveedor, deleteMovimientoCaja, createMovimientoCaja } from '../controllers/movimientos.js'

const router = express.Router()
console.log('routes cuentas')
router.get('/', getMovimientos)
router.post('/proveedores/', createMovimientoProveedor)
router.delete('/proveedores/:id', deleteMovimientoProveedor)

router.post('/cajas/', createMovimientoCaja)
router.get('/cajas/', getMovimientosCajas)
router.delete('/cajas/:id', deleteMovimientoCaja)

export default router