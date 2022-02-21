import express from 'express'

import { createProveedor, getProveedores, updateProveedor } from '../controllers/proveedores.js'

const router = express.Router()

router.get('/', getProveedores)
router.post('/', createProveedor)
router.patch('/', updateProveedor)

export default router