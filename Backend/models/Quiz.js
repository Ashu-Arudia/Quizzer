const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  question: String,
  options: String,
  correctAnswer: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Quiz", quizSchema);
