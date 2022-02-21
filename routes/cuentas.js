import express from 'express'

import { createCuenta, getCuentas } from '../controllers/cuentas.js'

const router = express.Router()
router.get('/', getCuentas)
router.post('/', createCuenta)

export default router