import { Application } from 'express';

import users from './users';
import restaurants from './restaurants';
import search from './search';

export default (app: Application): void => {
  //api/user/myuser
  users(app);

  //api/user/restaurant
  restaurants(app);

  ///api/restaurant/search/:city
  search(app);
};
