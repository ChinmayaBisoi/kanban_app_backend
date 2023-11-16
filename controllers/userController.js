const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    console.log("getAllUsers called");
    var allUsers = await User.find();
    if (!allUsers) {
      return res.status(400).json({ message: "User collection not found" });
    }
    res.json(allUsers);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = {
  getAllUsers,
};
