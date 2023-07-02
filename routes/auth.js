const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const checkLogin = require("../middleware/checkLogin");
router.post("/signup", (req, res) => {
  const { name, email, password, url } = req.body;

  //console.log("signup inside");
  //console.log(req.body);
  if (!email || !password || !name) {
    return res.status(422).json({ error: "Please add all required feilds" });
  }
  User.findOne({ email: email })
    .then((foundUser) => {
      if (foundUser) {
        return res.status(422).json({ error: "User already exists" });
      }
      bcrypt.hash(password, 12).then((hashedPass) => {
        const user = new User({
          email,
          password: hashedPass,
          name,
          profilePic: url,
        });

        user
          .save()
          .then((user) => {
            res.json({ msg: "SignUp Successful" });
          })
          .catch((err) => {
            console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(422).json({ error: "Provide all required feilds" });
  }
  User.findOne({ email }).then((savedUser) => {
    if (!savedUser) {
      return res.json({ error: "Invalid email or Password" });
    }
    bcrypt
      .compare(password, savedUser.password)
      .then((isMatch) => {
        if (isMatch) {
          const token = jwt.sign({ id: savedUser._id }, keys.JWT_SECRET);
          const { name, _id, email, followers, following, profilePic } =
            savedUser;
          return res.json({
            token,
            user: { _id, name, email, followers, following, profilePic },
          });
        } else {
          return res.json({ error: "Invalid email or password" });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
});

router.get("/protected", checkLogin, (req, res) => {
  res.status(200).json("hello,this is proteced");
});
module.exports = router;
