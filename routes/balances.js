import express from 'express'

import { setRegistroBalances, getRegistroBalances } from '../controllers/balances.js';

const router = express.Router()

router.post('/', setRegistroBalances)
router.get('/', getRegistroBalances)

export default router