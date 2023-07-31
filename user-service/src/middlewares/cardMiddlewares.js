import { body, header, param } from 'express-validator'

const createCardMiddleware = [
  body('userId')
    .notEmpty()
    .withMessage('You must provide a userId for the card'),
  body('name').notEmpty().withMessage('You must provide a name for the card'),
  body('number').notEmpty().withMessage('You must provide a card number'),
  body('secretCode')
    .notEmpty()
    .withMessage('You must provide a secret code for the card'),
  body('expiration')
    .notEmpty()
    .withMessage('You must provide a expiration date'),
  body('type').notEmpty().withMessage('You must provide a type of card')
]

const updateCardMiddleware = [
  body('id').exists().notEmpty().withMessage('You must provide a card id'),
  body('userId')
    .notEmpty()
    .withMessage('You must provide a userId for the card'),
  body('name').notEmpty().withMessage('You must provide a name for the card'),
  body('number').notEmpty().withMessage('You must provide a card number'),
  body('secretCode')
    .notEmpty()
    .withMessage('You must provide a secret code for the card'),
  body('expiration')
    .notEmpty()
    .withMessage('You must provide a expiration date'),
  body('type').notEmpty().withMessage('You must provide a type of card')
]

const deleteCardMiddleware = [
  body('id').exists().notEmpty().withMessage('You must provide a card id')
]

export { createCardMiddleware, updateCardMiddleware, deleteCardMiddleware }
