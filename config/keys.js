require("dotenv").config();
const keys = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};
module.exports = keys;
