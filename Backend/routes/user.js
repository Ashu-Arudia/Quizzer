const express = require("express");
const router = express.Router();
const User = require("../models/user");
const authenticateToken = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/authRole");
const Quiz = require("../models/Quiz");
const Questions = require("../models/Question");

router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("username");
    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

router.get(
  "/:quizId/questions",
  authenticateToken,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const quizId = req.params.quizId;
      const quiz = await Quiz.findById(quizId);
      const questions = await Questions.find({ quiz: quizId });
      res.json({ title: quiz.name, questions });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

router.get(
  "/:teacherId",
  authenticateToken,
  authorizeRoles("student"),
  async (req, res) => {
    try {
      const { teacherId } = req.params;

      // Find all quizzes created by the teacher
      const quizzes = await Quiz.find({ createdBy: teacherId }).select(
        "name level timeLimit topics"
      );

      if (!quizzes.length) {
        return res
          .status(200)
          .json({ quizzes: [], message: "No quizzes found for this teacher." });
      }

      // For each quiz, count the number of associated questions
      const quizzesWithQuestionCount = await Promise.all(
        quizzes.map(async (quiz) => {
          const questionCount = await Questions.countDocuments({
            quiz: quiz._id,
          });
          return {
            _id: quiz._id,
            name: quiz.name,
            level: quiz.level,
            timeLimit: quiz.timeLimit,
            topics: quiz.topics,
            questionCount: questionCount,
          };
        })
      );

      res.json({ quizzes: quizzesWithQuestionCount });
    } catch (err) {
      console.error("Error fetching quizzes:", err);
      res.status(500).json({ message: "Server Error" });
    }
  }
);

module.exports = router;
