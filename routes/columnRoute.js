const express = require("express");
const router = express.Router();
const columnController = require("../controllers/columnController");
const verifyJWT = require("../middlewares/verifyJWT");

router.use(verifyJWT);
router.post("/add", columnController.addColumn);
router.patch("/edit", columnController.updateColumn);
router.delete("/:id", columnController.deleteColumnById);

module.exports = router;
