import express from 'express'

import { createCliente, getClientes, updateCliente, deleteCliente, getSaldoCliente, getOrdenesCliente } from '../controllers/clientes.js'


const router = express.Router()
router.get('/', getClientes)
router.get('/saldo/:id', getSaldoCliente)
router.get('/ordenes/:id', (req, res) => getOrdenesCliente(req, res, false))
router.post('/', createCliente)
router.delete('/:id', deleteCliente)
router.patch('/', updateCliente)

export default router