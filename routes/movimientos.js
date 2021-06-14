import express from 'express'

import { getMovimientos } from '../controllers/movimientos.js'

const router = express.Router()
console.log('routes cuentas')
router.get('/', getMovimientos)

export default router