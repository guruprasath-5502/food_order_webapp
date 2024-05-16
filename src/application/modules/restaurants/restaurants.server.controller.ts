import cloudinary from 'cloudinary';
import mongoose from 'mongoose';

import { NextFunction, Request, Response } from 'express';

import Restaurant from '../../database/models/restaurant';

const createMyRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const existingRestaurant = await Restaurant.findOne({
      user: req.userId,
    });

    if (existingRestaurant) {
      const err = new Error('Restaurant already exists');
      Object.assign(err, { statusCode: 409 });
      return next(err);
    }

    const image = req.file as Express.Multer.File;
    const base64Image = Buffer.from(image.buffer).toString('base64');
    const dataURI = `data:${image.mimetype};base64,${base64Image}`;

    const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = uploadResponse.url;
    restaurant.user = new mongoose.Types.ObjectId(req.userId);
    restaurant.lastUpdated = new Date();

    await restaurant.save();

    return res.status(201).json({
      status: true,
      data: restaurant.toObject(),
    });
  } catch (error) {
    console.log(error);
    next(new Error('Error creating restaurant'));
  }
};

const restaurantController = { createMyRestaurant };

export default restaurantController;
