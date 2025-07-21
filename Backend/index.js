const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const mcqRoutes = require("./routes/mcq");
const userRoutes = require("./routes/user");
require("dotenv").config();
const app = express();

//Database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const cors = require("cors");
app.use(cors());

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//routes
app.use("/api/auth", authRoutes);
app.use("/api/mcq", mcqRoutes);
app.use("/api/user", userRoutes);

app.listen(process.env.PORT, () => console.log("Server started!!"));
