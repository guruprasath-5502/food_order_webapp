import { Application } from 'express';
import searchController from './search.server.controller';
import {
  validateSearchRequestCity,
  validateSearchRequestRestaurant,
} from './search.server.validation';

export default function (app: Application): void {
  // Search restaurant by city
  app.get(
    '/api/restaurant/search/:city',
    validateSearchRequestCity,
    searchController.searchRestaurants
  );

  // Search for a restaurant
  app.get(
    '/api/restaurant/detail/:restaurantId',
    validateSearchRequestRestaurant,
    searchController.getRestaurants
  );
}
