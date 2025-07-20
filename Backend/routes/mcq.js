const express = require("express");
const router = express.Router();
const MCQ = require("../models/Quiz");
const authenticateToken = require("../middleware/authmiddleware");
const authorizeRoles = require("../middleware/authRole");

// POST /api/mcq — Create new MCQ (Teacher only)
router.post(
  "/",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    const { question, options, correctAnswer } = req.body;

    // ✅ Validate data server-side
    if (
      !question ||
      !options ||
      !Array.isArray(options) ||
      options.length < 2
    ) {
      return res
        .status(400)
        .json({ msg: "Question and at least 2 options are required." });
    }

    if (!correctAnswer || !options.includes(correctAnswer)) {
      return res
        .status(400)
        .json({ msg: "Correct answer must match one of the options." });
    }

    try {
      const mcq = new MCQ({
        question,
        options,
        correctAnswer, // This is the correct *option text*
        createdBy: req.user.id,
      });

      await mcq.save();

      res.status(201).json({ msg: "MCQ created", mcq });
    } catch (err) {
      console.error("MCQ creation error:", err);
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// GET /api/mcq — Get all MCQs by logged-in teacher
router.get(
  "/",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      const mcqs = await MCQ.find({ createdBy: req.user.id });
      res.json(mcqs);
    } catch (err) {
      res.status(500).json({ msg: "Server error" });
    }
  }
);

// GET /api/mcq/:teacherId — Get MCQs by teacher (for students)
router.get("/:teacherId", async (req, res) => {
  try {
    const mcqs = await MCQ.find({ createdBy: req.params.teacherId }).populate(
      "createdBy",
      "email"
    );
    res.json({ questions: mcqs });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
