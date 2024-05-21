import { upload } from '../../../config/multer';

import { Application } from 'express';

import { jwtCheck, jwtParse } from '../../middlewares/auth';
import restaurantController from './restaurants.server.controller';
import { validateRestaurantRequest } from './restaurants.server.validation';

export default function (app: Application): void {
  // Get restaurant order
  app.get(
    '/api/user/restaurant/order',
    jwtCheck,
    jwtParse,
    restaurantController.getMyRestaurantOrder
  );

  //
  app.patch(
    '/api/user/restaurant/order/:orderId/status',
    jwtCheck,
    jwtParse,
    restaurantController.updateOrderStatus
  );

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
