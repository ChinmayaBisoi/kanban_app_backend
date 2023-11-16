const Column = require("../models/Column");

const addColumn = async (req, res) => {
  try {
    console.log("addColumn called");
    const { boardId, title } = req.body;

    if (!boardId || !title) {
      return res.status(400).json({
        message: "Board Id, title are required fields",
      });
    }

    const allColumnsInSameBoard = await Column.find({
      $and: [{ boardId: boardId }, { isDeleted: false }],
    });

    const columnObj = {
      boardId,
      title,
      order: allColumnsInSameBoard.length + 1,
    };

    const column = await Column.create(columnObj);

    if (column) {
      res.status(201).json({
        ok: true,
        message: "Column created successfully",
        column: { ...column.toObject(), id: column._id, cards: [] },
      });
    } else {
      res.status(400).json({ message: "Error creating column" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const updateColumn = async (req, res) => {
  try {
    console.log("updateColumn called");
    const { title, id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Column Id is required" });
    }

    if (!title) {
      return res.status(400).json({ message: "Title is a required field" });
    }

    const column = await Column.findById(id).exec();

    if (!column) {
      return res.status(400).json({ message: "Column not found" });
    }

    title ? (column.title = title) : (column.title = column.title);

    column.updatedAt = new Date().toUTCString();

    const newColumn = await column.save();

    return res.status(201).json({
      ok: true,
      message: `Column updated successfully`,
      column: { ...newColumn.toObject(), id: newColumn._id },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
      error: "Something went wrong in updateColumn",
    });
  }
};

const deleteColumnById = async (req, res) => {
  try {
    console.log("deleteColumnById called");
    const { id } = req.params;
    if (!id) return res.json(400).json({ message: "Column id is required" });

    const column = await Column.findById(id).exec();

    if (!column) return res.json(400).json({ message: "Column not found" });

    column.isDeleted = true;
    const deletedColumn = await column.save();
    return res.status(200).json({
      ok: true,
      message: `Column deleted successfully`,
      column: { ...deletedColumn.toObject(), id: deletedColumn._id },
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong in deleteColumnById" });
  }
};

module.exports = {
  deleteColumnById,
  addColumn,
  updateColumn,
};
