import express from 'express'

import { createOperacion, getOperaciones, getClienteOperaciones, deleteOperacion, hasOrden, updateOperacion } from '../controllers/operaciones.js'

const router = express.Router()

router.get('/', getOperaciones)
router.get('/:id', hasOrden)
router.get('/cliente/:id', getClienteOperaciones)
router.post('/', createOperacion)
router.delete('/:id', deleteOperacion)
router.patch('/', updateOperacion)

export default router