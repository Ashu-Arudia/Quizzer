const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
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

//routes
app.use("/api", authRoutes);

app.listen(process.env.PORT, () => console.log("Server started!!"));
