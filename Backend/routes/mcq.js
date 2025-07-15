const express = require("express");
const router = express.Router();
const MCQ = require("../models/Quiz");
const jwt = require("jsonwebtoken");

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Add user info to req
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};

// POST /api/mcq — Create new MCQ (Teacher only)
router.post("/", verifyToken, async (req, res) => {
  const { question, options, correctAnswer } = req.body;

  if (req.user.role !== "teacher") {
    return res.status(403).json({ msg: "Only teachers can create MCQs" });
  }

  try {
    const mcq = new MCQ({
      question,
      options,
      correctAnswer,
      createdBy: req.user.id,
    });
    await mcq.save();
    res.status(201).json({ msg: "MCQ created", mcq });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/mcq — Get all MCQs by logged-in teacher
router.get("/", verifyToken, async (req, res) => {
  try {
    const mcqs = await MCQ.find({ createdBy: req.user.id });
    res.json(mcqs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

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
