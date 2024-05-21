import { param } from 'express-validator';
import { handleValidationErrors } from '../../middlewares/validator';

export const validateSearchRequestCity = [
  param('city')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('City parameter must be a valid string'),
  handleValidationErrors,
];

export const validateSearchRequestRestaurant = [
  param('restaurantId')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Restaurant Id parameter must be a valid string'),
  handleValidationErrors,
];
