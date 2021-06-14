import express from 'express'

import { getOrdenes, createOrdenSolo, deleteOrden } from '../controllers/ordenes.js'

const router = express.Router()
console.log('routes ordenes')
router.get('/', getOrdenes)
// router.post('/', createOrden)
router.post('/', createOrdenSolo)
router.delete('/:id', deleteOrden)

export default router