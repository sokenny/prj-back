import express from 'express'

import { createOperacion, getOperaciones, getClienteOperaciones, deleteOperacion } from '../controllers/operaciones.js'

const router = express.Router()

router.get('/', getOperaciones)
router.get('/cliente/:id', getClienteOperaciones)
router.post('/', createOperacion)
router.delete('/:id', deleteOperacion)

export default router