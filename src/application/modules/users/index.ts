import { Application } from 'express';
import userController from './users.server.controller';

export default function (app: Application): void {
  app.post('/api/user/create-user', userController.createCurrentUser);
}
