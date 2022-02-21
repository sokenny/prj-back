import express from 'express'
import { getMovimientos, getMovimientosCajas, createMovimientoProveedor, deleteMovimientoProveedor, deleteMovimientoCaja, createMovimientoCaja, updateMovimientoProveedor, updateMovimientoCaja, exportMovimientosCajas, findMovimientosProveedorWithFilters, findMovimientosCajaWithFilters }  from '../controllers/movimientos.js'

const router = express.Router()
router.get('/', getMovimientos)
router.post('/proveedores/', createMovimientoProveedor)
router.delete('/proveedores/:id', deleteMovimientoProveedor)
router.patch('/proveedores/', updateMovimientoProveedor)
router.get('/proveedores/filter', findMovimientosProveedorWithFilters)
router.get('/cajas/filter', findMovimientosCajaWithFilters)
router.post('/cajas/', createMovimientoCaja)
router.get('/cajas/', getMovimientosCajas)
router.delete('/cajas/:id', deleteMovimientoCaja)
router.patch('/cajas/', updateMovimientoCaja)
router.get('/cajas/export', exportMovimientosCajas)

export default router