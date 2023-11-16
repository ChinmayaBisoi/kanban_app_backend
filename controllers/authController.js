const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const isValidRegisterRequest = ({ email, password }) => {
  if (!email) {
    return "Email is missing";
  }
  if (!password) {
    return "Password is missing";
  }
};

const register = async (req, res) => {
  try {
    var { email, password } = req.body;
    console.log("register function called");

    const errorMsg = isValidRegisterRequest({
      email,
      password,
    });

    if (errorMsg) {
      return res.status(400).json({ message: "Invalid Data : " + errorMsg });
    }

    email = email.toLowerCase();
    const duplicate = await User.findOne({ email: email }).lean().exec();
    if (duplicate) {
      return res
        .status(400)
        .json({ message: "User with this email id already exists" });
    }
    let hashedPassword = await bcrypt.hash(password, 10);
    const userObj = {
      email: email,
      password: hashedPassword,
    };
    const user = await User.create(userObj);
    if (user) {
      res.status(201).json({ ok: true, message: "User created" });
    } else {
      res.status(400).json({ message: "Invalid User data received" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req, res) => {
  try {
    console.log("login function called");
    const { email, password } = req.body;
    if (!email || !password) {
      return res.staus(400).json({ message: "All Fields are required" });
    }

    const foundOne = await User.findOne({
      $and: [{ email: email }, { isDeleted: false }],
    }).exec();

    if (!foundOne || !foundOne.isActive) {
      return res.status(401).json({ message: "unauthorized" });
    }

    const match = await bcrypt.compare(password, foundOne.password);

    if (!match) {
      return res.status(401).json({ message: "Unauthorized : Incorrect Password" });
    }

    const accessToken = jwt.sign(
      {
        userInfo: {
          email: foundOne.email,
          id: foundOne._id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("kanban_app_jwt", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ ok: true, accessToken, email, userId: foundOne._id });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong in login function" });
  }
};

const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies.kanban_app_jwt) return res.sendStatus(204);

  res.clearCookie("kanban_app_jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  
  return res.json({ ok: true, message: "User logged out, cookie cleared" });
};

const checkAuth = async (req, res) => {
  console.log("checkAuth function called");
  const accessToken = req.cookies.kanban_app_jwt;
  if (!accessToken) {
    return res.status(401).json({ message: "Unauthorized : Token not found" });
  }
  if (!req.userInfo) {
    return res
      .status(401)
      .json({ message: "Unauthorized : UserInfo not found" });
  }
  return res
    .status(200)
    .json({ ok: true, message: "Token verified", userInfo: req.userInfo });
};

module.exports = {
  register,
  login,
  logout,
  checkAuth,
};
