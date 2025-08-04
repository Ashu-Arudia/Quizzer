const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      default: "Easy",
    },
    timeLimit: {
      type: Number,
      default: 1,
    },
    visibility: {
      type: String,
      enum: ["Public", "Private"],
      default: "Public",
    },
    password: {
      type: String,
      required: function () {
        return this.visibility === "Private";
      },
      default: null,
    },
    topics: [String],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Quiz", quizSchema);
