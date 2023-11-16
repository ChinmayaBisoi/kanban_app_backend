const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const verifyJWT = require("../middlewares/verifyJWT");

// router.use(verifyJWT);
router.get("/", userController.getAllUsers);
// router.post("/", userController.addTodo);
// router.patch("/", userController.updateTodo);
// router.delete("/:id", userController.deleteTodoById);

module.exports = router;
