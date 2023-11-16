require("express-async-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/config");
require("dotenv").config();
const connectDB = require("./config/dbConn");

const app = express();
const PORT = config.port;

connectDB();

app.use(cors(config.corsOptions));
app.use(express.json());
app.use(cookieParser());

app.use((req, res, next) => {
  // Set allowed headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Set allowed methods
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

  // Set the 'Access-Control-Allow-Credentials' header to 'true'
  res.header("Access-Control-Allow-Credentials", "true");

  // Continue to the next middleware
  next();
});

app.get("/", (req, res) => {
  console.log("Kanban app backend");
  res.send("Greetings from Kanban app server!");
});

app.use("/users", require("./routes/userRoute.js"));

//protected with middleware verifyJWT for owner side
app.use("/boards", require("./routes/boardRoute"));

app.use("/columns", require("./routes/columnRoute"));

app.use("/cards", require("./routes/cardRoute"));

//for authentication
app.use("/auth", require("./routes/authRoute"));

mongoose.connection.once("open", () => {
  console.log("connected to DB");
  app.listen(PORT, () => console.log(`server is running on PORT ${PORT}`));
});

mongoose.connection.on("error", (err) => {
  console.log("Error in mongoose connection", err);
});
