import { Application } from 'express';

import users from './users';
import restaurants from './restaurants';
import search from './search';
import orders from './orders';

export default (app: Application): void => {
  //api/user/myuser
  users(app);

  //api/user/restaurant
  restaurants(app);

  //api/restaurant/
  search(app);

  //api/order/checkout
  orders(app);
};
