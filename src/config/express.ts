import http from 'http';

import express from 'express';
import cors from 'cors';

import routes from '../application/modules/index';
import logger from '../application/middlewares/logger';
import {
  handleError,
  apiNotFound,
} from '../application/middlewares/errorHandler';

const expressConfig = () => {
  const app = express();

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

  app.use(logger);

  routes(app);

  app.use(apiNotFound);
  app.use(handleError);

  const server = http.createServer(app);

  return server;
};

export default expressConfig;
