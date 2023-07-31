import { body, param, header } from 'express-validator'

const createUserMiddleware = [
  body('username').notEmpty().withMessage('You must provide a username'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
]

const updateUserMiddleware = [
  header('Authorization').notEmpty().withMessage('You must provide a token'),
  param('id').exists().notEmpty(),
  body('username').notEmpty().withMessage('You must provide a username'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
]

const deleteUserMiddleware = [
  header('Authorization').notEmpty().withMessage('You must provide a token'),
  param('id').exists().notEmpty()
]

const signinUserMiddleware = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
]

export {
  createUserMiddleware,
  updateUserMiddleware,
  deleteUserMiddleware,
  signinUserMiddleware
}
