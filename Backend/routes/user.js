const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/teachers", async (req, res) => {
  try {
    console.log("Fetching teachers from database...");
    const teachers = await User.find({ role: "teacher" }).select("_id email");
    console.log("Found teachers:", teachers.length);
    console.log("Teachers:", teachers);
    res.json({ teachers });
  } catch (err) {
    console.error("Error fetching teachers:", err);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
