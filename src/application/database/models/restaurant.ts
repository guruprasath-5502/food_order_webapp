import mongoose, { Document, Model, Schema } from 'mongoose';

export type MenuItemType = Document & {
  _id: string;
  name: string;
  price: number;
};

export type RestaurantType = Document & {
  _id: string;
  user: mongoose.Types.ObjectId;
  restaurantName: string;
  city: string;
  country: string;
  deliveryPrice: number;
  estimatedDeliveryTime: number;
  cuisines: string[];
  menuItems: MenuItemType[];
  imageUrl: string;
  lastUpdated: Date;
  flgUseStatus: number;
};

const menuItemSchema: Schema<MenuItemType> = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const restaurantSchema: Schema<RestaurantType> = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurantName: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  deliveryPrice: {
    type: Number,
    required: true,
  },
  estimatedDeliveryTime: {
    type: Number,
    required: true,
  },
  cuisines: [
    {
      type: String,
      required: true,
    },
  ],
  menuItems: [menuItemSchema],
  imageUrl: {
    type: String,
    required: true,
  },
  lastUpdated: {
    type: Date,
    required: true,
  },
  flgUseStatus: {
    type: Number,
    default: 1,
  },
});

const Restaurant: Model<RestaurantType> = mongoose.model<RestaurantType>(
  'Restaurant',
  restaurantSchema
);

export default Restaurant;
