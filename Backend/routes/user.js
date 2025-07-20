const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.get("/teachers", async (req, res) => {
  try {
    const teachers = await User.find({ role: "teacher" }).select("_id email");
    res.json({ teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
