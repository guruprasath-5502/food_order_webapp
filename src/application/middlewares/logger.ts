import { color, gray, cyanBright, magenta } from 'console-log-colors';
import { NextFunction, Request, Response } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
  const methodColors = {
    GET: 'green',
    POST: 'yellow',
    PUT: 'blueBright',
    DELETE: 'red',
  };

  const colors =
    methodColors[req.method as keyof typeof methodColors] || 'white';

  console.log(
    color(`${req.method}`, colors as any),
    `${magenta(`${req.protocol}`)}${gray(`://`)}${cyanBright(
      `${req.headers.host}`
    )}${gray(`${req.originalUrl}`)}`
  );

  next();
};

export default logger;
