import mongoose from "mongoose";
import asyncMiddleware from "../middlewares/asyncMiddleware.js";
const connectToDB = asyncMiddleware(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
});

export default connectToDB;
