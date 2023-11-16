const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT);
router.post("/add", cardController.addCard);
router.patch("/edit", cardController.updateCard);
router.delete("/:id", cardController.deleteCardById);

module.exports = router;
