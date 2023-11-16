const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  try {
    const accessToken = req.cookies.kanban_app_jwt;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: "unauthorized : Access token not found" });
    }
    const token = accessToken;
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });
      req.userInfo = decoded.userInfo;
      next();
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = verifyJWT;
