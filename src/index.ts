import { Server } from 'http';

import 'dotenv/config';

import mongoose from './config/mongoose';
import express from './config/express';

const startServer = async () => {
  try {
    const database = await mongoose();

    console.log('Database Connection Established');

    const app = express();

    const server: Server = await new Promise((resolve) => {
      app.listen(process.env.PORT || 8080, () => {
        console.log(`Server listening on port ${process.env.PORT || 8080}`);
        resolve(app);
      });
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

startServer();
