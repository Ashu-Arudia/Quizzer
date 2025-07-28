const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
  },
  isProfileComplete: {
    type: Boolean,
    default: false,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
});

module.exports = mongoose.model("User", userSchema);
