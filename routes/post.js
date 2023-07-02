const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const checkLogin = require("../middleware/checkLogin");
const { route } = require("./auth");
const Post = mongoose.model("Post");
const Comment = mongoose.model("Comment");

router.get("/allposts", checkLogin, (req, res) => {
  Post.find()
    .populate("postedBy", "_id name profilePic")
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/followingPosts", checkLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate("postedBy", "_id name profilePic")
    .then((posts) => {
      res.status(200).json({ posts });
    })
    .catch((err) => {
      console.log(err);
    });
});
router.post("/createpost", checkLogin, (req, res) => {
  const { title, description, pic } = req.body;
  if (!title || !description || !pic) {
    return res
      .status(402)
      .json({ error: "Please Provide all required feilds" });
  }
  const post = new Post({
    title,
    description,
    pic,
    postedBy: req.user,
  });

  post
    .save()
    .then((savedPost) => {
      //console.log(savedPost);
      return res.status(201).json({ post: savedPost });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/myposts", checkLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((myPosts) => {
      res.json({ myPosts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/like", checkLogin, (req, res) => {
  //console.log("like");
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      return res.json({ result });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

router.put("/unlike", checkLogin, (req, res) => {
  //console.log("unlike");
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .then((result) => {
      return res.json({ result });
    })
    .catch((err) => {
      return res.status(422).json({ error: err });
    });
});

router.post("/comment", checkLogin, (req, res) => {
  console.log("comment");
  const comment = new Comment({
    comment: req.body.comment,
    postedBy: req.user._id,
  });
  comment
    .save()
    .then((savedComment) => {
      // console.log(savedComment);
      Post.findByIdAndUpdate(
        req.body.postId,
        {
          $push: { comments: savedComment._id },
        },
        {
          new: true,
        }
      )
        .populate("comments", "_id postedBy")
        .then((result) => {
          //console.log(result);
          return res.json({ result });
        })
        .catch((err) => {
          return res.status(422).json({ error: err });
        });
    })
    .catch((err) => console.log(err));
});

router.get("/:postId", checkLogin, (req, res) => {
  Post.findById(req.params.postId)
    .populate({
      path: "comments",
      populate: {
        path: "postedBy",
        select: "name",
      },
    })
    .then((post) => {
      return res.status(200).json({ post });
    })
    .catch((err) => console.log(err));
});

router.delete("/:postId", checkLogin, (req, res, next) => {
  Post.findById(req.params.postId)
    .then((post) => {
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      //console.log(post);
      return Comment.deleteMany({ _id: { $in: post.comments } }).then(
        (comments) => {
          return post.deleteOne({ _id: post._id }).then((deletedPost) => {
            res.json({
              post: deletedPost,
              comments,
            });
          });
        }
      );
    })
    .catch((error) => {
      next(error);
    });
});

module.exports = router;
