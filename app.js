const express = require("express");
const app = express();
const mongoose = require("mongoose");
const keys = require("./config/keys");
const PORT = process.env.PORT || 5000;
require("./models/user");
require("./models/post");
require("./models/comment");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const UserRouter = require("./routes/user");
//console.log(keys);
//console.log(keys);
mongoose.connect(keys.MONGO_URI);
mongoose.connection.on("connected", () => {
  console.log(`Connected to the DATABASE`);
});
mongoose.connection.on("error", (err) => {
  console.log(keys);
  console.log("error", err);
});

app.use(express.json());
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", UserRouter);

app.get("/", (req, res) => {
  res.send("hello world");
});

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
