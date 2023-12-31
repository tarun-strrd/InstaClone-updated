const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const keys = require("./config/keys");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
require("dotenv").config();
require("./models/user");
require("./models/post");
require("./models/comment");
require("./models/otp");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const UserRouter = require("./routes/user");

mongoose.connect(keys.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to the DATABASE`);
});
mongoose.connection.on("error", (err) => {
  //console.log(keys);
  console.log("error", err);
});
app.use(
  cors({
    origin: ["https://insta-clone-updated.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", UserRouter);
app.get("/", (req, res) => {
  console.log("ndj");
  res.json("hello");
});
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
