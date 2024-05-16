import { Application } from 'express';

import users from './users';
import restaurants from './restaurants';

export default (app: Application): void => {
  //api/user/myuser
  users(app);

  //api/user/restaurant
  restaurants(app);
};
