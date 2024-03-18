import { body } from 'express-validator'

const signupValidation = [
  body('email').isEmail().withMessage('Please enter a valid email!').normalizeEmail().notEmpty(),
  body('username').trim().notEmpty(),
  body('password').trim().isLength({ min: 8 }).notEmpty()
]

export default signupValidation
