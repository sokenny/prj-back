import express from 'express'

import { getConfig, updateConfig, setCambioDia, getCambioDia, getHistorialCambios } from '../controllers/config.js'

const router = express.Router()
router.get('/', getConfig)
router.patch('/', updateConfig)
router.get('/cambio_dia', getCambioDia)
router.post('/cambio_dia', setCambioDia)
router.get('/historial_cambios', getHistorialCambios)

export default router