import { upload } from '../../../config/multer';

import { Application } from 'express';

import { jwtCheck, jwtParse } from '../../middlewares/auth';
import restaurantController from './restaurants.server.controller';
import { validateRestaurantRequest } from './restaurants.server.validation';

export default function (app: Application): void {
  // creates new restaurant
  app.post(
    '/api/user/restaurant',
    jwtCheck,
    jwtParse,
    upload.single('imageFile'),
    validateRestaurantRequest,
    restaurantController.createMyRestaurant
  );
}
