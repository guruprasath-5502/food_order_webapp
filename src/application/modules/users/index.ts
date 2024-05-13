import { Application } from 'express';
import userController from './users.server.controller';
import { jwtCheck } from '../../middlewares/auth';

export default function (app: Application): void {
  app.post('/api/user/create-user', jwtCheck, userController.createCurrentUser);
}
