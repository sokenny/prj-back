import express from 'express'

import { createProveedor, getProveedores } from '../controllers/proveedores.js'

const router = express.Router()

router.get('/', getProveedores)
router.post('/', createProveedor)

export default router