const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: {
    type: [Number],
    validate: {
      validator: function (arr) {
        return (
          arr.length > 0 &&
          arr.every((num) => Number.isInteger(num) && num >= 0 && num < 4)
        );
      },
      message: "Correct answers must be valid option indices (0–3).",
    },
  },
});

module.exports = mongoose.model("Question", questionSchema);
