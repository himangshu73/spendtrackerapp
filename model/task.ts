import { Schema, Document, Mongoose } from "mongoose";
import mongoose from "mongoose";

export interface ITask extends Document {
  task: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema: Schema<ITask> = new Schema({
  task: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
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

const Task =
  (mongoose.models.Task as mongoose.Model<ITask>) ||
  mongoose.model<ITask>("Task", taskSchema);

export default Task;
