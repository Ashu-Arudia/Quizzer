const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const mcqRoutes = require("./routes/mcq");
const userRoutes = require("./routes/user");
const passport = require("passport");
const quizRoutes = require("./routes/quiz");
require("dotenv").config();
const app = express();
require("./middleware/passport");

//Database
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const cors = require("cors");
app.use(cors());

//middleware
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/mcq", mcqRoutes);
app.use("/api/user", userRoutes);
app.use("/api/quizzes", quizRoutes);

app.listen(process.env.PORT, () => console.log("Server started!!"));
