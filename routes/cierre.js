import express from 'express'

import {  getExistencia, getCierre  } from '../controllers/cierre.js'

const router = express.Router()

router.get('/', getExistencia)
router.get('/existencia', getExistencia)
router.get('/cierre', getCierre)


export default router