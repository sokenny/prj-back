import express from 'express'

import { favRow, changeEstado } from '../controllers/globales.js'

const router = express.Router()
console.log('routes cuentas')
router.post('/favRow', favRow)
router.post('/changeEstado', changeEstado)

export default router