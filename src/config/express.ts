import http from 'http';

import express from 'express';
import cors from 'cors';

import routes from '../application/modules/index';
import logger from '../application/middlewares/logger';
import {
  handleError,
  apiNotFound,
} from '../application/middlewares/errorHandler';
import { health } from '../application/utils/health';
import helmet from 'helmet';

const expressConfig = () => {
  const app = express();

  // app.use(helmet());

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(logger);

  app.use('/api/order/checkout/webhook', express.raw({ type: '*/*' }));

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ limit: '15mb', extended: true }));

  app.get('/health', health);

  routes(app);

  app.use(apiNotFound);
  app.use(handleError);

  const server = http.createServer(app);

  return server;
};

export default expressConfig;
