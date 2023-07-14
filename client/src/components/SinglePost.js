import React, { useState, useEffect } from "react";

const SinglePost = (props) => {
  const { postId } = props;
  //console.log(postId);
  //console.log("inside");
  const [post, setPost] = useState({});

  useEffect(() => {
    console.log("inde");
    fetch(`http://localhost:5000/post/${postId}`, {
      method: "GET",
      headers: {
        "Content-Type": "applicaton/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        //console.log("odien");
        if (!res.ok) {
          throw new Error("Failed to fetch post data");
        }
        res
          .json()
          .then((data) => {
            console.log(data);
            setPost(data);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, [post]);

  return (
    <div>
      if(post.title)? (
      {
        <div style={{ display: "flex", flexDirection: "row", maxWidth: "70%" }}>
          <div style={{ marginRight: "auto" }}>
            <i className="material-icons">
              <span class="material-symbols-outlined">cancel</span>
            </i>
          </div>
          <div>
            <div>
              <img src={post.pic} style={{ width: "40%" }} />
            </div>
            <div>
              <p>{post.title}</p>
              <p>{post.description}</p>
              {post.comments.map((comment) => {
                <div>
                  <p>{comment.postedBy.name}</p>
                  <p>{comment.comment}</p>
                </div>;
              })}
            </div>
          </div>
        </div>
      }
      ) :({<p>dhdh</p>})
    </div>
  );
};

export default SinglePost;
