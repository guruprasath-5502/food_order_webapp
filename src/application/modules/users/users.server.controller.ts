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
      return res
        .status(200)
        .json({ status: true, data: existingUser.toObject() });
    }

    const newUser = new User(req.body);

    await newUser.save();

    return res.status(201).json({ status: true, data: newUser.toObject() });
  } catch (error) {
    console.log(error);
    next(new Error('Error creating user'));
  }
};

const updateCurrentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, addressLine1, country, city } = req.body;

    const user = await User.findById(req.userId).select(['-__v']);

    if (!user) {
      const err = new Error('User not found');
      Object.assign(err, { statusCode: 404 });
      return next(err);
    }

    user.name = name;
    user.addressLine1 = addressLine1;
    user.country = country;
    user.city = city;

    await user.save();

    return res.status(202).json({ status: true, data: user.toObject() });
  } catch (error) {
    console.log(error);
    next(new Error('Error updating user'));
  }
};

const userController = { createCurrentUser, updateCurrentUser };

export default userController;
