import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserType = Document & {
  _id: string;
  auth0Id: string;
  email: string;
  name?: string;
  addressLine1?: string;
  country?: string;
  flgUseStatus: number;
};

const userSchema: Schema<UserType> = new mongoose.Schema(
  {
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
    country: {
      type: String,
    },
    flgUseStatus: {
      type: Number,
      default: 1,
    },
  },
  {
    versionKey: false, // This line excludes the "__v" field from queries
  }
);

const User: Model<UserType> = mongoose.model<UserType>('User', userSchema);

export default User;
