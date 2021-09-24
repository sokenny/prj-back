import express from 'express'

import { getAll, getBalancesCajas } from '../controllers/reportes.js'

const router = express.Router()
router.get('/', getAll)
router.get('/cajas', getBalancesCajas)

export default router