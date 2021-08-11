import express from 'express'

import { createCliente, getClientes, updateCliente, deleteCliente } from '../controllers/clientes.js'

const router = express.Router()
console.log('routes getClientes')
router.get('/', getClientes)
router.post('/', createCliente)
router.delete('/:id', deleteCliente)
router.patch('/', updateCliente)

export default router