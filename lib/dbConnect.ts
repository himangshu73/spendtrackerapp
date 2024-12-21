const mongoose = require("mongoose");

export default async function dbconnect() {
  try {
    await mongoose.connect(process.env.MONGODBURI);
    console.log("Connected to Database successfully");
  } catch (error) {
    console.error("Database Connection Failed, ", error);
    process.exit(1);
  }
}
