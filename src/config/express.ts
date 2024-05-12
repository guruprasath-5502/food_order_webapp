import http from 'http';

import express from 'express';
import cors from 'cors';

import routes from '../application/modules/index';

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

  routes(app);

  const server = http.createServer(app);

  return server;
};

export default expressConfig;
