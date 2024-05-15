import { Application } from 'express';

import users from './users';

export default (app: Application): void => {
  //api/user/myuser
  users(app);
};
