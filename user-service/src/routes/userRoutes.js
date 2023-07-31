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
  signinUserMiddleware,
  updateUserMiddleware
} from '../middlewares/userMiddlewares.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { tokenValidatorMiddleware } from '../middlewares/tokenValidatorMiddleware.js'

const router = express.Router()

router.get('', tokenValidatorMiddleware, validateRequest, getAllUsers)
router.get('/:id', tokenValidatorMiddleware, validateRequest, getUser)
router.post('', createUserMiddleware, validateRequest, createUser)
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
