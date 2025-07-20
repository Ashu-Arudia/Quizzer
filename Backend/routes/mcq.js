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
      console.log("Fetching MCQs for user:", req.user.id);
      const mcqs = await MCQ.find({ createdBy: req.user.id });
      console.log("Found MCQs:", mcqs.length);
      res.json(mcqs);
    } catch (err) {
      console.error("Error fetching MCQs:", err);
      res.status(500).json({ msg: "Server error", error: err.message });
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

// DELETE /api/mcq/:id — Delete MCQ (Teacher only)
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("teacher"),
  async (req, res) => {
    try {
      console.log("Deleting MCQ:", req.params.id, "for user:", req.user.id);

      const mcq = await MCQ.findOneAndDelete({
        _id: req.params.id,
        createdBy: req.user.id
      });

      if (!mcq) {
        return res.status(404).json({ error: "MCQ not found or access denied" });
      }

      console.log("MCQ deleted successfully");
      res.json({ msg: "MCQ deleted successfully" });
    } catch (err) {
      console.error("Error deleting MCQ:", err);
      res.status(500).json({ error: "Server error", details: err.message });
    }
  }
);

module.exports = router;
