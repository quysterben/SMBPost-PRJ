import { body } from 'express-validator'

const signinValidation = [
  body('email').isEmail().withMessage('Please enter a valid email!').normalizeEmail().notEmpty(),
  body('password').trim().isLength({ min: 8 }).notEmpty()
]

export default signinValidation
