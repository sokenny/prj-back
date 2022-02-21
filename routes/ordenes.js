import express from 'express'

import { getOrdenes, createOrdenSolo, createFactura, deleteOrden, createCash, liquidarTransferencias, editOrdenes, findOrdenesWithFilters } from '../controllers/ordenes.js'

const router = express.Router()
router.get('/', getOrdenes)
// router.patch('/listas', setListas)
router.post('/', createOrdenSolo)
router.post('/edit', editOrdenes)
router.post('/facturas', createFactura)
router.delete('/:id', deleteOrden)
router.post('/cash', createCash)
router.post('/liquidarTransferencias', liquidarTransferencias)
router.get('/filter', findOrdenesWithFilters)

export default router