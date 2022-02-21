import express from 'express'

import { favRow, changeEstado } from '../controllers/globales.js'

const router = express.Router()
router.post('/favRow', favRow)
router.post('/changeEstado', changeEstado)

export default router