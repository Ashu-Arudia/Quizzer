const express = require("express");
const authenticateToken = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/authRole");
const router = express.Router();
const Quiz = require("../models/Quiz");
const Questions = require("../models/Question");

router.post("/questions", async (req, res) => {
  try {
    const newQuestion = new Questions(req.body);
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put(
  "/question/:Id",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const questionId = req.params.Id;
      const question = await Questions.findById(questionId);
      const { quiz, text, options, correct } = req.body;

      question.quiz = quiz || question.quiz;
      question.text = text || question.text;
      question.options = options || question.options;
      question.correct = correct || questicorrectuiz;

      await question.save();
      return res.status(200).json({ message: "Question updated" });
    } catch (err) {
      res.json(400).json({ message: err.message });
    }
  }
);

router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const quizId = req.params.id;
      const userId = req.user.id;

      const quiz = await Quiz.findById(quizId);
      if (!quiz) return res.status(404).json({ message: "Quiz not found" });

      // Only allow the creator to delete
      if (quiz.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      // Delete all related questions first
      await Questions.deleteMany({ quiz: quizId });

      // Then delete the quiz
      await Quiz.findByIdAndDelete(quizId);

      return res
        .status(200)
        .json({ message: "Quiz and related questions deleted" });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  }
);

router.delete(
  "/question/:Id",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const questionId = req.params.Id;

      if (!questionId) {
        return res.status(404).json({ message: "Question not found" });
      }

      await Questions.findByIdAndDelete(questionId);

      return res.status(200).json({ message: "Question deleted successfully" });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.put(
  "/:Id",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const quizId = req.params.Id;
      const userId = req.user.id;
      const { name, level, timeLimit, visibility, password, topics } = req.body;
      const quiz = await Quiz.findById(quizId);

      if (!quiz) return res.status(404).json({ message: "Quiz not found" });

      if (quiz.createdBy.toString() !== userId.toString()) {
        return res.status(403).json({ message: "Not authorized" });
      }

      quiz.name = name || quiz.name;
      quiz.level = level || quiz.level;
      quiz.timeLimit = timeLimit || quiz.timeLimit;
      quiz.visibility = visibility || quiz.visibility;
      quiz.password = visibility === "Private" ? password : null;
      quiz.topics = topics || [];

      await quiz.save();
      return res.status(200).json({ message: "Quiz updated", quiz });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.post("/questions/bulk", async (req, res) => {
  try {
    const { questions } = req.body;

    // Basic validation to ensure a 'questions' array is present in the request body.
    if (!questions || !Array.isArray(questions)) {
      return res
        .status(400)
        .json({ message: "Request body must contain a 'questions' array." });
    }

    // Use Mongoose's `insertMany` method, which is highly efficient for
    // saving multiple documents and handles validation for each one.
    const savedQuestions = await Questions.insertMany(questions);

    console.log("Questions saved successfully:", savedQuestions);
    res.status(201).json(savedQuestions);
  } catch (err) {
    // This detailed error log is crucial for debugging.
    // It will show if there are any validation failures for individual questions.
    console.error("Error saving multiple questions:", err);
    res.status(400).json({ message: err.message, errorDetails: err });
  }
});

// Refactored POST endpoint for creating a new quiz
// This endpoint no longer handles questions
router.post(
  "/",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const newQuiz = new Quiz({ ...req.body, createdBy: userId });
      const savedQuiz = await newQuiz.save();
      res.status(201).json(savedQuiz);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

router.get(
  "/",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const quiz = await Quiz.find({ createdBy: req.user.id });
      res.json(quiz);
    } catch (err) {
      console.error("Error fetching quiz ", err);
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  }
);

router.get(
  "/:quizId",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const id = req.params.quizId;
      const quiz = await Quiz.findById(id);
      res.json(quiz);
    } catch (err) {
      console.error("Error fetching quiz ", err);
      res.status(500).json({ msg: "Server Error", error: err.message });
    }
  }
);

router.get(
  "/:quizId/questions",
  authenticateToken,
  authorizeRoles("teacher"),
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

router.delete(
  "/:quizId",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    const id = req.params.quizId;
    const userId = req.user.id;

    try {
      if (!id) {
        return res.status(404);
      }

      if (Quiz.createdBy !== userId) {
        return res.status(403);
      }

      await Quiz.findByIdAndDelete(id);
      res.status(202).json({ message: "Quiz deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500);
    }
  }
);

module.exports = router;
