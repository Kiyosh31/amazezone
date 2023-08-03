import { body, param, header } from 'express-validator'

const createUserMiddleware = [
  body('name').notEmpty().withMessage('You must provide a name'),
  body('lastName').notEmpty().withMessage('You must provide a lastName'),
  body('birth').notEmpty().withMessage('You must provide a birth'),
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty().withMessage('You must supply a password')
]

const getUserMiddleware = [
  param('id').exists().notEmpty().withMessage('You must provide a userId')
]

const updateUserMiddleware = [
  header('Authorization').notEmpty().withMessage('You must provide a token'),
  param('id').exists().notEmpty(),
  body('name').notEmpty().withMessage('You must provide a name'),
  body('lastName').notEmpty().withMessage('You must provide a lastName'),
  body('birth').notEmpty().withMessage('You must provide a birth'),
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
  getUserMiddleware,
  updateUserMiddleware,
  deleteUserMiddleware,
  signinUserMiddleware
}
