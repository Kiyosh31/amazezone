import express from 'express'
import { userRouter } from './userRoutes.js'
import { cardRouter } from './cardRoutes.js'
import { addressRouter } from './addressRoutes.js'
import { sellerRouter } from './sellerRouter.js'

const router = express.Router()

router.use('/seller', sellerRouter)
router.use('/user', userRouter)
router.use('/address', addressRouter)
router.use('/card', cardRouter)

export { router as rootRouter }
