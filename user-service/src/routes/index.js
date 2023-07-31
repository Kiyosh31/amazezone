import express from 'express'
import { userRouter } from './userRoutes.js'
import { cardRouter } from './cardRoutes.js'
import { addressRouter } from './addressRoutes.js'

const router = express.Router()

router.use('/users', userRouter)
router.use('/address', addressRouter)
router.use('/card', cardRouter)

export { router as rootRouter }
