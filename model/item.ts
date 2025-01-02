import { Schema, Document } from "mongoose";
import mongoose from "mongoose";

export interface InterItem extends Document {
  user: mongoose.Schema.Types.ObjectId;
  itemname: string;
  quantity: number;
  unit: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}

const itemSchema: Schema<InterItem> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId },
  itemname: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
});

const Item =
  (mongoose.models.Item as mongoose.Model<InterItem>) ||
  mongoose.model<InterItem>("Item", itemSchema);

export default Item;
