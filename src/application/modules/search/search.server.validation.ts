import { param } from 'express-validator';
import { handleValidationErrors } from '../../middlewares/validator';

export const validateSearchRequest = [
  param('city')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('City parameter must be a valid string'),
  handleValidationErrors,
];
