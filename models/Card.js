const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema(
  {
    columnId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Column",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: String,
    },
    isDeleted: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model("Card", cardSchema);

module.exports = Card;
