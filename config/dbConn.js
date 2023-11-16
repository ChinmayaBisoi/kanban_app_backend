const mongoose = require("mongoose");
const config = require("./config");

const connectDB = async () => {
  try {
    await mongoose.connect(config.databaseUri);
  } catch (err) {
    console.log("error connecting to DB", err);
  }
};

module.exports = connectDB;
