import { Application } from 'express';
import userController from './users.server.controller';
import { jwtCheck, jwtParse } from '../../middlewares/auth';
import { validateMyUserRequest } from '../../middlewares/validator';

export default function (app: Application): void {
  //creates user data in db after authenticating in auth0, if already exists simply returns ok
  app.post('/api/user/myuser', jwtCheck, userController.createCurrentUser);

  //to update the user details
  app.put(
    '/api/user/myuser',
    jwtCheck,
    jwtParse,
    validateMyUserRequest,
    userController.updateCurrentUser
  );
}
