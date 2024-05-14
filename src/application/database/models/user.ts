import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserType = Document & {
  _id: string;
  auth0Id: string;
  email: string;
  name?: string;
  addressLine1?: string;
  country?: string;
  city?: string;
  flgUseStatus: number;
};

const userSchema: Schema<UserType> = new mongoose.Schema({
  auth0Id: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  addressLine1: {
    type: String,
  },
  city: {
    type: String,
  },
  country: {
    type: String,
  },
  flgUseStatus: {
    type: Number,
    default: 1,
  },
});

const User: Model<UserType> = mongoose.model<UserType>('User', userSchema);

export default User;
