import { body } from 'express-validator';
import { handleValidationErrors } from '../../middlewares/validator';

export const validateRestaurantRequest = [
  body('restaurantName')
    .isString()
    .notEmpty()
    .withMessage('Restaurant Name is required'),
  body('city').isString().notEmpty().withMessage('City is required'),
  body('country').isString().notEmpty().withMessage('Country is required'),
  body('deliveryPrice')
    .isFloat({ min: 0 })
    .withMessage('Delivery Price is invalid'),
  body('estimatedDeliveryTime')
    .isInt({ min: 0 })
    .withMessage('Estimated Delivery Time is invalid'),
  body('cuisines')
    .isArray()
    .withMessage('Cuisines should be an array')
    .notEmpty()
    .withMessage('Cuisines should not be empty'),
  body('menuItems').isArray().withMessage('Menu Items should be an array'),
  body('menuItems.*.name')
    .notEmpty()
    .isString()
    .withMessage('Menu Item Name is required'),
  body('menuItems.*.price')
    .notEmpty()
    .isFloat({ min: 0 })
    .withMessage('Menu Item Price is invalid'),
  handleValidationErrors,
];
