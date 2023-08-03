import express from 'express'
import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  signinUser,
  updateUser
} from '../controllers/userController.js'
import {
  createUserMiddleware,
  deleteUserMiddleware,
  getUserMiddleware,
  signinUserMiddleware,
  updateUserMiddleware
} from '../middlewares/userMiddlewares.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { tokenValidatorMiddleware } from '../middlewares/tokenValidatorMiddleware.js'

const router = express.Router()

router.post('', createUserMiddleware, validateRequest, createUser)

router.get(
  '/:id',
  tokenValidatorMiddleware,
  getUserMiddleware,
  validateRequest,
  getUser
)

router.get('', tokenValidatorMiddleware, validateRequest, getAllUsers)

router.put(
  '/:id',
  tokenValidatorMiddleware,
  updateUserMiddleware,
  validateRequest,
  updateUser
)

router.delete(
  '/:id',
  tokenValidatorMiddleware,
  deleteUserMiddleware,
  validateRequest,
  deleteUser
)

router.post('/signin', signinUserMiddleware, validateRequest, signinUser)

export { router as userRouter }
