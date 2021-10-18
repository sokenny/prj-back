import express from 'express'

import { getMovimientos, getMovimientosCajas, createMovimientoProveedor, deleteMovimientoProveedor, deleteMovimientoCaja, createMovimientoCaja, updateMovimientoProveedor, updateMovimientoCaja, exportMovimientosCajas }  from '../controllers/movimientos.js'

const router = express.Router()
console.log('routes cuentas')
router.get('/', getMovimientos)
router.post('/proveedores/', createMovimientoProveedor)
router.delete('/proveedores/:id', deleteMovimientoProveedor)
router.patch('/proveedores/', updateMovimientoProveedor)

router.post('/cajas/', createMovimientoCaja)
router.get('/cajas/', getMovimientosCajas)
router.delete('/cajas/:id', deleteMovimientoCaja)
router.patch('/cajas/', updateMovimientoCaja)

router.get('/cajas/export', exportMovimientosCajas)

export default router