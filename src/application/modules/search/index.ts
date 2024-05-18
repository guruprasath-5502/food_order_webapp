import { Application } from 'express';
import searchController from './search.server.controller';
import { validateSearchRequest } from './search.server.validation';

export default function (app: Application): void {
  // Search restaurant by city
  app.get(
    '/api/restaurant/search/:city',
    validateSearchRequest,
    searchController.searchRestaurants
  );
}
