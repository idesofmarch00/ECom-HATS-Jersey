const { body, validationResult } = require('express-validator');

const validateSignup = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('name')
    .notEmpty()
    .withMessage('Name is required')
    .trim()
    .escape(),
];

const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

const validateProduct = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .trim(),
  body('price')
    .isNumeric()
    .withMessage('Price must be a number')
    .custom((value) => value > 0)
    .withMessage('Price must be greater than 0'),
  body('stock')
    .isNumeric()
    .withMessage('Stock must be a number')
    .custom((value) => value >= 0)
    .withMessage('Stock must be 0 or greater'),
  body('brand')
    .notEmpty()
    .withMessage('Brand is required')
    .trim(),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .trim(),
];

const validateCart = [
  body('productId')
    .notEmpty()
    .withMessage('Product ID is required'),
  body('quantity')
    .isNumeric()
    .withMessage('Quantity must be a number')
    .custom((value) => value > 0)
    .withMessage('Quantity must be greater than 0'),
];

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateSignup,
  validateLogin,
  validateProduct,
  validateCart,
  handleValidationErrors,
};
