import { upload } from '../../../config/multer';

import { Application } from 'express';

import { jwtCheck, jwtParse } from '../../middlewares/auth';
import restaurantController from './restaurants.server.controller';
import { validateRestaurantRequest } from './restaurants.server.validation';

export default function (app: Application): void {
  // get the restaurant
  app.get(
    '/api/user/restaurant',
    jwtCheck,
    jwtParse,
    restaurantController.getMyRestaurant
  );

  // creates new restaurant
  app.post(
    '/api/user/restaurant',
    jwtCheck,
    jwtParse,
    upload.single('imageFile'),
    validateRestaurantRequest,
    restaurantController.createMyRestaurant
  );

  // Update Restaurant
  app.put(
    '/api/user/restaurant',
    jwtCheck,
    jwtParse,
    upload.single('imageFile'),
    validateRestaurantRequest,
    restaurantController.updateMyRestaurant
  );
}
