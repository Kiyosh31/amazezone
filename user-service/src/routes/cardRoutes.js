import express from 'express'
import {
  createCard,
  deleteCard,
  updateCard
} from '../controllers/cardController.js'
import {
  createCardMiddleware,
  updateCardMiddleware,
  deleteCardMiddleware
} from '../middlewares/cardMiddlewares.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { tokenValidatorMiddleware } from '../middlewares/tokenValidatorMiddleware.js'

const router = express.Router()

router.post(
  '',
  tokenValidatorMiddleware,
  createCardMiddleware,
  validateRequest,
  createCard
)
router.put(
  '',
  tokenValidatorMiddleware,
  updateCardMiddleware,
  validateRequest,
  updateCard
)
router.delete(
  '',
  deleteCardMiddleware,
  tokenValidatorMiddleware,
  validateRequest,
  deleteCard
)

export { router as cardRouter }
