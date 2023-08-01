import { body, param, header } from 'express-validator'

const createSellerMiddleware = [
  body('username').notEmpty().withMessage('You must provide a username'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
]

export { createSellerMiddleware }
