import mongoose, { Document, Model, Schema } from 'mongoose';

export type OrderType = Document & {
  _id: string;
  restaurant: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  deliveryDetails: {
    email: string;
    name: string;
    addressLine1: string;
    city: string;
  };
  cartItems: MenuItem[];
  totalAmount: number;
  status: string;
  createdAt: Date;
  flgUseStatus: number;
};

type MenuItem = Document & {
  menuItemId: string;
  quantity: string;
  name: string;
};

const orderSchema: Schema<OrderType> = new mongoose.Schema({
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryDetails: {
    email: { type: String, required: true },
    name: { type: String, required: true },
    addressLine1: { type: String, required: true },
    city: { type: String, required: true },
  },
  cartItems: [
    {
      menuItemId: { type: String, required: true },
      quantity: { type: Number, required: true },
      name: { type: String, required: true },
    },
  ],
  totalAmount: Number,
  status: {
    type: String,
    enum: ['placed', 'paid', 'inProgress', 'outForDelivery', 'delivered'],
  },
  createdAt: { type: Date, default: Date.now },
  flgUseStatus: {
    type: Number,
    default: 1,
  },
});

const Order: Model<OrderType> = mongoose.model<OrderType>('Order', orderSchema);

export default Order;
