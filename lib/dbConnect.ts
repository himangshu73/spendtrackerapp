const mongoose = require("mongoose");

export default async function dbconnect() {
  if (mongoose.connection.readyState === 1) {
    console.log("Already connected to Database");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODBURI);
    console.log("Connected to Database successfully");
  } catch (error) {
    console.error("Database Connection Failed, ", error);
    process.exit(1);
  }
}
