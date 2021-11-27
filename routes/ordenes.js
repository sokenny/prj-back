import express from 'express'

import { getOrdenes, createOrdenSolo, createFactura, updateFactura, deleteOrden, getOrdenesHoy, createCash, updateCash, setListas, liquidarTransferencias, editOrdenes } from '../controllers/ordenes.js'

const router = express.Router()
console.log('routes ordenes')
router.get('/', getOrdenes)
router.patch('/listas', setListas)
// router.get('/hoy', getOrdenesHoy)
// router.post('/', createOrden)
router.post('/', createOrdenSolo)
router.post('/edit', editOrdenes)
router.post('/facturas', createFactura)
router.patch('/facturas', updateFactura)
router.delete('/:id', deleteOrden)

router.post('/cash', createCash)
router.patch('/cash', updateCash)

router.post('/liquidarTransferencias', liquidarTransferencias)

export default router