import express from 'express';
import { body } from 'express-validator';
import { registerCustomer, loginCustomer, checkEmailorPhonealredyRegistered, refreshToken } from '../controllers/authController.js';
import validate from '../middlewares/validation.js';

const router = express.Router();

// Ruta para registrar un nuevo cliente
router.post(
  '/register',
  [
    body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z0-9\s]+$/).withMessage('Name must contain only letters, numbers and spaces'),

    body('emailOrPhone')
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('Valid email is required')
    .normalizeEmail(),

    body('password')
      .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
      .matches(/\d/).withMessage('Pasword must contain at least one number')
      .matches(/[a-zA-Z]/).withMessage('Password must contain at least one letter'),
    
    body('role')
      .optional()
      .isIn(['admin', 'customer']).withMessage('Role must to be admin,customer or guest'),
  ],
  validate,
  registerCustomer
);

// Ruta para iniciar sesión de un cliente
router.post(
  '/login',
    [
        body('emailOrPhone')
        .notEmpty().withMessage('email is required')
        .isEmail().withMessage('Valid email is required')
        .normalizeEmail(),
        body('password')
        .notEmpty().withMessage('Password is required'),
    ],
    validate,
    loginCustomer
);

// Ruta para verificar si un email o teléfono ya está registrado
router.get('/check-email-or-phone', checkEmailorPhonealredyRegistered);
router.post('/refresh-token', refreshToken);

export default router;