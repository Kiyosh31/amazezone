import express from 'express'
import { createSeller } from '../controllers/sellerController.js'

const router = express.Router()

router.post('', createSeller)

export { router as sellerRouter }
