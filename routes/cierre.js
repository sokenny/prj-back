import express from 'express'

import { getCierreTable, getExistencia, getCierre  } from '../controllers/cierre.js'

const router = express.Router()

router.get('/', getExistencia)
router.get('/cierreTable', getCierreTable)
router.get('/existencia', getExistencia)
router.get('/cierre', getCierre)


export default router