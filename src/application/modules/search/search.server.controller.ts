import { NextFunction, Request, Response } from 'express';
import Restaurant from '../../database/models/restaurant';

const searchRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const city = req.params.city;

    const searchQuery = (req.query.searchQuery as string) || '';
    const selectedCuisines = (req.query.selectedCuisines as string) || '';
    const sortOption = (req.query.sortOption as string) || 'lastUpdated';
    const page = parseInt(req.query.page as string) || 1;

    let query: any = {};

    query['city'] = new RegExp(city, 'i');
    const cityCheck = await Restaurant.countDocuments(query);

    if (cityCheck === 0) {
      return res.status(404).json({
        status: false,
        data: {
          data: [],
          pagination: {
            total: 0,
            page: 1,
            pages: 1,
          },
        },
      });
    }

    if (selectedCuisines) {
      const cuisinesArray = selectedCuisines
        .split(',')
        .map((cuisine) => new RegExp(cuisine, 'i'));

      query['cuisines'] = { $all: cuisinesArray };
    }

    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, 'i');
      query['$or'] = [
        { restaurantName: searchRegex },
        { cuisines: { $in: [searchRegex] } },
      ];
    }

    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 })
      .skip(skip)
      .limit(pageSize)
      .lean();

    const total = await Restaurant.countDocuments(query);

    const response = {
      data: restaurants,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / pageSize),
      },
    };

    return res.status(200).json({ status: true, data: response });
  } catch (error) {
    console.log(error);
    next(new Error('Error fetching data'));
  }
};

const getRestaurants = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const restaurantId = req.params.restaurantId;

    const restaurant = await Restaurant.findById(restaurantId);

    if (!restaurant) {
      console.log('edfsaef', restaurantId);
      const err = new Error('Restaurant not found');
      Object.assign(err, { statusCode: 404 });
      return next(err);
    }

    return res.status(200).json({ status: true, data: restaurant.toObject() });
  } catch (error) {
    console.log(error);
    next(new Error('Error fetching data'));
  }
};

const searchController = { searchRestaurants, getRestaurants };

export default searchController;
