export const dynamic = "force-static";

import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: { type: String, trim: true },
    image: { type: String },
  },
  {
    timestamps: true,
    strict: true,
  }
);

const User = mongoose.models?.User || mongoose.model("User", UserSchema);
export default User;
