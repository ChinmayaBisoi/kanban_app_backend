const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:3000",
      "https://cbi-todo-app.vercel.app",
    ];
    console.log("origin ->", origin);
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      console.log("problem here in corsOptions");
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

module.exports = corsOptions;
