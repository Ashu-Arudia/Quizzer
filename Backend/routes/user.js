const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("username");
    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
});

module.exports = router;
