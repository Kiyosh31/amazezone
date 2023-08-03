import express from 'express'
import {
  createAddress,
  deleteAddress,
  getAddress,
  getAllAddress,
  updateAddress
} from '../controllers/addressController.js'
import {
  createAddressMiddleware,
  deleteAddressMiddleware,
  updateAddressMiddleware
} from '../middlewares/addressMiddlewares.js'
import { validateRequest } from '../middlewares/validateRequest.js'
import { tokenValidatorMiddleware } from '../middlewares/tokenValidatorMiddleware.js'

const router = express.Router()

router.post(
  '',
  tokenValidatorMiddleware,
  createAddressMiddleware,
  validateRequest,
  createAddress
)

router.get('/:id', tokenValidatorMiddleware, validateRequest, getAddress)

router.get('/all/:id', tokenValidatorMiddleware, validateRequest, getAllAddress)

router.put(
  '/:id',
  tokenValidatorMiddleware,
  updateAddressMiddleware,
  validateRequest,
  updateAddress
)

router.delete(
  '/:id',
  tokenValidatorMiddleware,
  deleteAddressMiddleware,
  validateRequest,
  deleteAddress
)

export { router as addressRouter }
