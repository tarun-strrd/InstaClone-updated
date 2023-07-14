const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commentLikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  postedOn: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
  },
});

mongoose.model("Comment", CommentSchema);
