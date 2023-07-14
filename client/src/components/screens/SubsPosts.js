import React, { useContext, useEffect, useState } from "react";
import CreatePost from "./CreatePost";
import { UserContext } from "../../App";
import { Link } from "react-router-dom";

const SubsPosts = () => {
  const { state, dispatch } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/post/followingPosts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        //console.log(res);
        res
          .json()
          .then((data) => {
            const newPosts = data.posts.map((post) => {
              return { ...post, show: false };
            });
            setPosts(newPosts);
          })
          .catch((err) => console.log(err));
      })

      .catch((err) => console.log(err));
  }, []);

  const toggleLike = (url, postId) => {
    fetch(`http://localhost:5000${url}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        postId,
      }),
    })
      .then((res) =>
        res
          .json()
          .then((data) => {
            //console.log(data.result);
            const newPostsData = posts.map((post) => {
              if (post._id === data.result._id) return data.result;
              else return post;
            });
            setPosts(newPostsData);
          })
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
  };

  const addComment = (comment, postId) => {
    fetch("/post/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        comment,
        postId,
      }),
    }).then((res) =>
      res.json().then((data) => {
        const newPostsData = posts.map((post) => {
          if (data.result._id === post._id) {
            return data.result;
          } else {
            return post;
          }
        });
        setPosts(newPostsData);
      })
    );
  };

  const deletePost = (postId) => {
    fetch(`/post/${postId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }).then((res) =>
      res.json().then((data) => {
        const newPostsData = posts.filter((post) => {
          return post._id !== data.post._id;
        });
        setPosts(newPostsData);
      })
    );
  };
  return (
    <div>
      {state &&
        posts.map((post) => {
          //console.log(post);
          return (
            <div className="card home-card" key={post._id}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <div>
                  <img
                    src={post.postedBy.profilePic}
                    style={{
                      height: 20,
                      width: 20,
                      margin: 6,
                      marginTop: 15,
                      borderRadius: "50%",
                    }}
                  />
                </div>
                <div>
                  <h5 style={{ fontSize: 16, fontWeight: 500 }}>
                    <Link
                      to={
                        post.postedBy._id !== state._id
                          ? `/profile/${post.postedBy._id}`
                          : "/profile"
                      }
                    >
                      {post.postedBy.name}
                    </Link>
                    {post.postedBy._id === state._id && (
                      <i
                        className="material-icons"
                        style={{ float: "right" }}
                        onClick={() => deletePost(post._id)}
                      >
                        delete
                      </i>
                    )}
                  </h5>
                </div>
              </div>
              <div className="card-image">
                <img src={post.pic} alt="imge" />
              </div>
              <div className="card-content">
                {post.likes.includes(state._id) ? (
                  <div style={{ display: "flex" }}>
                    <i
                      className="material-icons"
                      onClick={() => toggleLike("post/unlike", post._id)}
                      style={{
                        color: "red",
                        marginRight: 10,
                        cursor: "pointer",
                      }}
                    >
                      favorite
                    </i>
                    <p>{post.likes.length} likes</p>
                  </div>
                ) : (
                  <div style={{ display: "flex" }}>
                    <i
                      className="material-icons"
                      onClick={() => toggleLike("post/like", post._id)}
                      style={{ marginRight: 10, cursor: "pointer" }}
                    >
                      favorite_border
                    </i>
                    <p>{post.likes.length} likes</p>
                  </div>
                )}
                <h6>{post.title}</h6>
                <p>{post.description}</p>
                <Link>
                  <span
                    style={{ color: "grey" }}
                    onClick={() => (post.show = true)}
                  >
                    View all {post.comments.length} comments
                  </span>
                </Link>
                <form
                  onSubmit={(e) => {
                    addComment(e.target[0].value, post._id);
                  }}
                >
                  <input type="text" placeholder="Add a comment" />
                </form>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default SubsPosts;
