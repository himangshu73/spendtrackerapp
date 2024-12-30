import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  dob: Date,
  username: { type: String, unique: true },
  sex: String,
});

const UserProfile =
  mongoose.models.UserProfile || mongoose.model("UserProfile", ProfileSchema);

export default UserProfile;
