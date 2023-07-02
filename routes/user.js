const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkLogin = require("../middleware/checkLogin");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");
const User = mongoose.model("User");

router.get("/:userId", checkLogin, (req, res, next) => {
  //console.log(req.params);
  User.findOne({ _id: req.params.userId })
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      Post.find({ postedBy: req.params.userId })
        .populate("postedBy", "_id name")
        .then((posts) => {
          return res.status(200).json({ user, posts });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
});

router.put("/follow", checkLogin, (req, res) => {
  const { followingId } = req.body;
  ///console.log(req.body);
  User.findByIdAndUpdate(
    req.user._id,
    {
      $push: { following: followingId },
    },
    { new: true }
  )
    .select("-password")
    .then((userWhoFollowed) => {
      User.findByIdAndUpdate(
        followingId,
        {
          $push: { followers: req.user._id },
        },
        { new: true }
      )
        .select(-"password")
        .then((userWhoGotFollowed) => {
          return res.json({ userWhoFollowed, userWhoGotFollowed });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
});

router.put("/unfollow", checkLogin, (req, res) => {
  const { unFollowingId } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { following: unFollowingId },
    },
    { new: true }
  )
    .then((userWhoUnFollowed) => {
      User.findByIdAndUpdate(
        unFollowingId,
        {
          $pull: { followers: req.user._id },
        },
        { new: true }
      )
        .then((userWhoGotUnFollowed) => {
          return res.json({ userWhoUnFollowed, userWhoGotUnFollowed });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
});

router.put("/updatePic", checkLogin, (req, res) => {
  console.log("updatePic");
  User.findByIdAndUpdate(
    req.user._id,
    { $set: { profilePic: req.body.url } },
    { new: true }
  )
    .then((updatedUser) => {
      console.log(updatedUser);
      res.status(200).json({ updatedUser });
    })
    .catch((err) => console.log(err));
});

module.exports = router;
