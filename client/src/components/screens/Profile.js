import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [myPosts, setMyPosts] = useState([]);
  const [url, setUrl] = useState(undefined);
  const [image, setImage] = useState("");
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    fetch("/post/myposts", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) =>
        res
          .json()
          .then((data) => {
            setMyPosts(data.myPosts);
          })
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "p9ssvyz3");
      data.append("cloud_name", "dfqau4u7l ");
      fetch("https://api.cloudinary.com/v1_1/dfqau4u7l/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) =>
          res
            .json()
            .then((data) => {
              setUrl(data.url);
              fetch("/user/updatePic", {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  url,
                }),
              }).then((res) =>
                res.json().then((updatedUser) => {
                  console.log();
                  localStorage.setItem(
                    "user",
                    JSON.stringify({
                      ...state,
                      profilePic: updatedUser.updatedUser.profilePic,
                    })
                  );
                  dispatch({
                    type: "UPDATEPIC",
                    payload: updatedUser.updatedUser.profilePic,
                  });
                })
              );
            })
            .catch((err) => console.log(err))
        )
        .catch((err) => console.log(err));
    }
  }, [image]);

  const uploadPic = (file) => {
    setImage(file);
  };

  return (
    <>
      {state ? (
        <div style={{ maxWidth: 600, margin: "auto" }}>
          <div style={{ margin: "30px auto", borderBottom: "1px solid grey" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",

                maxWidth: 500,
              }}
            >
              <div>
                <img
                  className="profile-pic"
                  src={
                    state.profilePic
                      ? state.profilePic
                      : "https://tse1.mm.bing.net/th?id=OIP.0g9t2RRpr0rhAKaJPbQriQHaHk&pid=Api&P=0&h=180"
                  }
                  alt="Profile pic"
                />
              </div>
              <div>
                <h5>{state !== null ? state.name : "loading"}</h5>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "115%",
                  }}
                >
                  <h6>{myPosts.length} posts</h6>
                  <h6>
                    {state ? state.following.length : "loading"} following
                  </h6>
                  <h6>
                    {state ? state.followers.length : "loading"} followers
                  </h6>
                </div>
              </div>
            </div>
            <div className="file-field input-field" style={{ marginLeft: 40 }}>
              <div className="btn">
                <span>Update Profile Pic</span>
                <input
                  type="file"
                  onChange={(e) => {
                    uploadPic(e.target.files[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
          </div>
          <div className="photo-gallery">
            {myPosts.map((post) => {
              return (
                <img
                  className="gallery-pic"
                  src={post.pic}
                  alt="Post pic"
                  key={post._id}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h1>loading</h1>
      )}
    </>
  );
};

export default Profile;
