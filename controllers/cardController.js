const Card = require("../models/Card");

const addCard = async (req, res) => {
  try {
    console.log("addCard called");
    const { columnId, title, description, dueDate } = req.body;

    if (!columnId || !title || !description) {
      return res.status(400).json({
        message: "Board Id, title, description are required fields",
      });
    }

    const allCardsInSameColumn = await Card.find({
      $and: [{ columnId: columnId }, { isDeleted: false }],
    });

    const cardObj = {
      columnId,
      title,
      description,
      dueDate: dueDate || "",
      order: allCardsInSameColumn.length + 1,
    };

    const card = await Card.create(cardObj);

    if (card) {
      res.status(201).json({
        ok: true,
        message: "Card created successfully",
        card: { ...card.toObject(), id: card._id },
      });
    } else {
      res.status(400).json({ message: "Error creating card" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateCard = async (req, res) => {
  try {
    console.log("updateCard called");
    const { title, id, description, dueDate } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Card Id is required" });
    }

    const card = await Card.findById(id).exec();

    if (!card) {
      return res.status(400).json({ message: "Card not found" });
    }

    title ? (card.title = title) : (card.title = card.title);
    description
      ? (card.description = description)
      : (card.description = card.description);
    dueDate ? (card.dueDate = dueDate) : (card.dueDate = card.dueDate);

    card.updatedAt = new Date().toUTCString();

    const newCard = await card.save();

    return res.status(201).json({
      ok: true,
      message: `Card updated successfully`,
      card: { ...newCard.toObject(), id: newCard._id },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
      error: "Something went wrong in updateCard",
    });
  }
};

const deleteCardById = async (req, res) => {
  try {
    console.log("deleteCardById called");
    const { id } = req.params;
    if (!id) return res.json(400).json({ message: "Card id is required" });

    const card = await Card.findById(id).exec();

    if (!card) return res.json(400).json({ message: "Card not found" });

    card.isDeleted = true;
    const deletedCard = await card.save();
    return res.status(200).json({
      ok: true,
      message: `Card deleted successfully`,
      card: { ...deletedCard.toObject(), id: deletedCard._id },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong in deleteCardById" });
  }
};

module.exports = {
  deleteCardById,
  addCard,
  updateCard,
};
