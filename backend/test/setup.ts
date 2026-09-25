import mongoose from "mongoose";
import dotenv from "dotenv";
import { afterAll, beforeAll } from "vitest";

dotenv.config();

const MONGO_TEST_URI = process.env.MONGO_TEST_URI;

if (!MONGO_TEST_URI) {
  throw new Error("MONGO_TEST_URI is not defined in .env");
}

beforeAll(async () => {
  await mongoose.connect(MONGO_TEST_URI);

  console.log("Test MongoDB connected");
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();

  console.log("Test MongoDB disconnected");
});
