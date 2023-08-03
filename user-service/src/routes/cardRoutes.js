import express from 'express'
import {
  createCard,
  deleteCard,
  getAllCards,
  getCard,
  updateCard
} from '../controllers/cardController.js'
import {
  createCardMiddleware,
  updateCardMiddleware,
  deleteCardMiddleware,
  getCardMiddleware
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

router.get(
  '/:id',
  tokenValidatorMiddleware,
  getCardMiddleware,
  validateRequest,
  getCard
)

router.get('/all/:id', tokenValidatorMiddleware, validateRequest, getAllCards)

router.put(
  '/:id',
  tokenValidatorMiddleware,
  updateCardMiddleware,
  validateRequest,
  updateCard
)

router.delete(
  '/:id',
  deleteCardMiddleware,
  tokenValidatorMiddleware,
  validateRequest,
  deleteCard
)

export { router as cardRouter }
