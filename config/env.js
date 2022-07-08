import dotenv from "dotenv";

dotenv.config();

let environment = process.env.NODE_ENV;

export default {
  MONGO_URI:
    environment === "development"
      ? process.env.LOCAL_MONGO_URL
      : process.env.LOCAL_MONGO_URL,
  APIs_API_ENDPOINT: process.env.APIs_API_ENDPOINT,
};
