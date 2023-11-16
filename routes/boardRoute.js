const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT);
router.get("/all", boardController.getAllBoards);
router.post("/id", boardController.getBoardById);
router.post("/add", boardController.addBoard);
router.patch("/edit", boardController.updateBoard);
router.delete("/:id", boardController.deleteBoardById);

module.exports = router;
