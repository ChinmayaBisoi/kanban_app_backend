require("dotenv").config();
const corsOptions = require("./corsOptions");


const config = {
  port: process.env.PORT || 8080,
  corsOptions: corsOptions,
  databaseUri: process.env.DATABASE_URI || "",
};

module.exports = config;
