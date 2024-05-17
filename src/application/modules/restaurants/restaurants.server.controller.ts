import mongoose from 'mongoose';

import { NextFunction, Request, Response } from 'express';

import Restaurant from '../../database/models/restaurant';
import uploadImage from '../../utils/uploadImage';

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

    const imgResponseUrl = await uploadImage(req.file as Express.Multer.File);

    const restaurant = new Restaurant(req.body);
    restaurant.imageUrl = imgResponseUrl;
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

const getMyRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId }).select(
      '-__v'
    );

    if (!restaurant) {
      const err = new Error('Restaurant not found');
      Object.assign(err, { statusCode: 404 });
      return next(err);
    }

    return res.status(200).json({ status: true, data: restaurant.toObject() });
  } catch (error) {
    console.log(error);
    next(new Error('Error fetching restaurant'));
  }
};

const updateMyRestaurant = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurant = await Restaurant.findOne({ user: req.userId }).select(
      '-__v'
    );

    if (!restaurant) {
      const err = new Error('Restaurant not found');
      Object.assign(err, { statusCode: 404 });
      return next(err);
    }

    restaurant.restaurantName = req.body.restaurantName;
    restaurant.city = req.body.city;
    restaurant.country = req.body.country;
    restaurant.deliveryPrice = req.body.deliveryPrice;
    restaurant.estimatedDeliveryTime = req.body.estimatedDeliveryTime;
    restaurant.cuisines = req.body.cuisines;
    restaurant.menuItems = req.body.menuItems;
    restaurant.lastUpdated = new Date();

    if (req.file) {
      const imgResponseUrl = await uploadImage(req.file);
      restaurant.imageUrl = imgResponseUrl;
    }

    await restaurant.save();

    return res.status(200).json({ status: true, data: restaurant.toObject() });
  } catch (error) {
    console.log(error);
    next(new Error('Error updating restaurant'));
  }
};

const restaurantController = {
  createMyRestaurant,
  getMyRestaurant,
  updateMyRestaurant,
};

export default restaurantController;
