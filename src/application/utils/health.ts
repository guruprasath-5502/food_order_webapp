import { Request, Response } from 'express';

export const health = async (req: Request, res: Response) => {
  return res.send({ message: 'health OK!' });
};
