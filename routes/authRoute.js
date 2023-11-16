const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyJWT = require("../middlewares/verifyJWT");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

router.use(verifyJWT);
router.get("/check-auth", authController.checkAuth);
module.exports = router;
