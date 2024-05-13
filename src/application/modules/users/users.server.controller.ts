import { NextFunction, Request, Response } from 'express';
import User from '../../database/models/user';

const createCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { auth0Id } = req.body;

    const existingUser = await User.findOne({ auth0Id }).select(['-__v']);

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);

    await newUser.save();

    return res.status(201).json({ status: true, data: newUser.toObject() });
  } catch (error) {
    console.log(error);

    const err = new Error('Error creating user');
    Object.assign(err, { statusCode: 500 });
    next(err);
  }
};

const userController = { createCurrentUser };

export default userController;
