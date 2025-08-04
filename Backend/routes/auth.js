const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
require("dotenv").config();

const client = new OAuth2Client(process.env.CLIENT_ID);

// Google OAuth start
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    let redirectUrl;
    // Redirect to appropriate frontend page
    if (!user.isProfileComplete) {
      redirectUrl = `${process.env.URL}/signup?token=${token}`;
    } else {
      redirectUrl =
        user.role === "teacher"
          ? `${process.env.URL}/teacher0?token=${token}&role=${user.role}`
          : `${process.env.URL}/student?token=${token}&role=${user.role}`;
    }

    res.redirect(redirectUrl);
  }
);

// Register
router.post("/register", async (req, res) => {
  const { username, password, role, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const UserId = decoded.id;

    const user = await User.findById(UserId);
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.username = username;
    user.role = role;
    user.isProfileComplete = true;
    await user.save();
    res.status(200).json({ msg: "Account created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      user: { id: user._id, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
