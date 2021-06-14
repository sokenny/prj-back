import express from 'express'

import { createCliente, getClientes, deleteCliente } from '../controllers/clientes.js'

const router = express.Router()
console.log('routes getClientes')
router.get('/', getClientes)
router.post('/', createCliente)
router.delete('/:id', deleteCliente)

export default router