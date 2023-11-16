const Board = require("../models/Board");
const Card = require("../models/Card");
const Column = require("../models/Column");
const mongoose = require("mongoose");

const getAllBoards = async (req, res) => {
  try {
    const { id, email } = req.userInfo;
    const boards = await Board.find({
      $and: [{ userEmail: email }, { userId: id }, { isDeleted: false }],
    });
    return res.status(200).json({
      ok: true,
      boards: boards.map((board) => {
        return { ...board.toObject(), id: board._id };
      }),
    });
  } catch (err) {
    return res.status(500).json({ message: `Unexpected Error : ${err}` });
  }
};

const getBoardById = async (req, res) => {
  try {
    console.log("getBoardById called");
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Board id is required" });
    }
    const board = await Board.findById(id).exec();
    if (!board) {
      return res
        .status(400)
        .json({ ok: true, message: "Board not found", board });
    }

    const columns = await Column.find({
      $and: [{ boardId: id }, { isDeleted: false }],
    });
    const columnIds = columns.map((column) => column._id);

    const cards = await Card.find({
      $and: [{ columnId: { $in: columnIds } }, { isDeleted: false }],
    });

    const formattedCards = cards.map((card) => {
      return { ...card.toObject(), id: card._id };
    });

    const columnsWithCards = columns.map((column) => {
      const columnCards = formattedCards.filter((card) =>
        card.columnId.equals(column._id)
      );

      return { ...column.toObject(), id: column._id, cards: columnCards };
    });

    return res.status(200).json({
      ok: true,
      board: {
        ...board.toObject(),
        id: board._id,
        columns: columnsWithCards,
      },
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: `Unexpected err : ${err}` });
  }
};

const addBoard = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  const error = "Error in addBoard";

  try {
    console.log("addBoard called");
    const { id, email } = req.userInfo;
    const { title, description, labels = [], isPinned = false } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Title, description are required fields",
      });
    }

    if (!id) {
      return res.status(400).json({
        message: "Unauthorized: User id invalid",
      });
    }

    const boardObj = {
      userId: id,
      title,
      description,
      isPinned,
      labels,
      userEmail: email,
    };

    const board = await Board.create([boardObj], { session });

    const columnsData = [
      { title: "To Do", order: 1, isDeleted: false },
      { title: "In Progress", order: 2, isDeleted: false },
      { title: "Completed", order: 3, isDeleted: false },
    ];

    const columns = await Column.create(
      columnsData.map((column) => ({
        ...column,
        boardId: board[0]._id,
      })),
      { session }
    );

    await session.commitTransaction();

    res.status(201).json({
      ok: true,
      message: "Board created successfully",
      board: board[0],
      columns,
    });
  } catch (err) {
    await session.abortTransaction();
    console.log(err);
    return res.status(500).json({ message: err.message, error });
  } finally {
    session.endSession();
  }
};

const updateBoard = async (req, res) => {
  try {
    console.log("updateBoard called");
    const { title, description, id, isPinned = false, labels = [] } = req.body;
    if (!id) {
      return res.status(400).json({ message: "Board Id is required" });
    }

    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Title, description are required fields" });
    }

    const board = await Board.findById(id).exec();

    if (!board) {
      return res.status(400).json({ message: "Board not found" });
    }

    title ? (board.title = title) : (board.title = board.title);
    description
      ? (board.description = description)
      : (board.description = board.description);
    isPinned ? (board.isPinned = isPinned) : (board.isPinned = board.isPinned);
    labels ? (board.labels = labels) : (board.labels = board.labels);
    board.updatedAt = new Date().toUTCString();

    const newBoard = await board.save();

    return res.status(201).json({
      ok: true,
      message: `Board updated successfully`,
      board: newBoard,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: err.message,
      error: "Something went wrong in updateBoard",
    });
  }
};

const deleteBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.json(400).json({ message: "Board id is required" });

    const board = await Board.findById(id).exec();

    if (!board) return res.json(400).json({ message: "Board not found" });

    board.isDeleted = true;
    const deletedBoard = await board.save();
    return res.status(200).json({
      ok: true,
      message: `Board deleted successfully`,
      board: deletedBoard,
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Something went wrong in deleteBoardById" });
  }
};

module.exports = {
  getBoardById,
  addBoard,
  updateBoard,
  deleteBoardById,
  getAllBoards,
};
