import express from 'express'

import { createOperacion, getOperaciones, getClienteOperaciones, deleteOperacion, updateBajada, updateSubida, updateCrypto, hasOrden, updateCambio } from '../controllers/operaciones.js'

const router = express.Router()

router.get('/', getOperaciones)
router.get('/:id', hasOrden)
router.get('/cliente/:id', getClienteOperaciones)
router.post('/', createOperacion)
router.delete('/:id', deleteOperacion)

router.patch('/bajadas', updateBajada)

router.patch('/subidas', updateSubida)

router.patch('/cryptos', updateCrypto)

router.patch('/cambios', updateCambio)


export default router