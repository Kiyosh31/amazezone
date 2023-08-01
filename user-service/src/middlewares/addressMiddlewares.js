import { body, header, param } from 'express-validator'

const createAddressMiddleware = [
  body('userId').notEmpty().withMessage('You must provide a userId'),
  body('name').notEmpty().withMessage('You must provide a name'),
  body('address').notEmpty().withMessage('You must provide an address'),
  body('postalCode').notEmpty().withMessage('You must provide a postalCode'),
  body('phone').notEmpty().withMessage('You must provide a phone')
]

const updateAddressMiddleware = [
  param('id').notEmpty().withMessage('You must provide an id'),
  body('userId').notEmpty().withMessage('You must provide a userId'),
  body('name').notEmpty().withMessage('You must provide a name'),
  body('address').notEmpty().withMessage('You must provide an address'),
  body('postalCode').notEmpty().withMessage('You must provide a postalCode'),
  body('phone').notEmpty().withMessage('You must provide a phone')
]

const deleteAddressMiddleware = [
  param('id').notEmpty().withMessage('You must provide an id')
]

export {
  createAddressMiddleware,
  updateAddressMiddleware,
  deleteAddressMiddleware
}
