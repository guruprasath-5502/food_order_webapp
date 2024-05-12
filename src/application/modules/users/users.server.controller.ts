import { Request, Response } from 'express';
import User from '../../database/models/user';

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const { auth0Id } = req.body;

    const existingUser = await User.findOne({ auth0Id }).select('-__v');

    if (existingUser) {
      return res.status(200).send();
    }

    const newUser = new User(req.body);

    await newUser.save();

    return res.status(201).json({ status: true, data: newUser.toObject() });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      error: {
        statusCode: 500,
        message: 'Error creating user',
      },
    });
  }
};

const userController = { createCurrentUser };

export default userController;
