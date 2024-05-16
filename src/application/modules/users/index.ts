import { Application } from 'express';
import { jwtCheck, jwtParse } from '../../middlewares/auth';
import userController from './users.server.controller';
import { validateMyUserRequest } from './users.server.validation';

export default function (app: Application): void {
  //get user details
  app.get(
    '/api/user/myuser',
    jwtCheck,
    jwtParse,
    userController.getCurrentUser
  );

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
