import express from 'express'

import { getAll, getBalancesCajas, oldGetBalancesCajas } from '../controllers/reportes.js'

const router = express.Router()
router.get('/', getAll)
router.get('/cajas', (req, res)=>getBalancesCajas(req, res, false))
router.get('/cajasOld', (req, res)=>oldGetBalancesCajas(req, res, true))

export default router