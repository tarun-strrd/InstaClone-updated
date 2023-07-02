import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../App";
import { useParams } from "react-router-dom";
const UserProfile = () => {
  const [userPosts, setUserPosts] = useState(null);
  const [profile, setProfile] = useState(null);
  const { userId } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const [showFollow, setShowFollow] = useState(null);
  //console.log(state);
  useEffect(() => {
    //console.log(userId);
    if (state) {
      fetch(`/user/${userId}`, {
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
              //console.log(data);
              setProfile(data.user);
              setUserPosts(data.posts);
              console.log("follwers", data.user.followers, "stae", state);
              {
                state && data.user.followers.includes(state._id)
                  ? setShowFollow(false)
                  : setShowFollow(true);
              }
            })
            .catch((err) => console.log(err))
        )
        .catch((err) => console.log(err));
    }
  }, [state]);

  const followUser = () => {
    console.log("follow");
    fetch("/user/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        followingId: userId,
      }),
    })
      .then((res) =>
        res
          .json()
          .then((data) => {
            dispatch({
              type: "UPDATE",
              payload: {
                followers: data.userWhoFollowed.followers,
                following: data.userWhoFollowed.following,
              },
            });

            localStorage.setItem(
              "user",
              JSON.stringify({
                ...state,
                followers: data.userWhoFollowed.followers,
                following: data.userWhoFollowed.following,
              })
            );
            setProfile((prevState) => {
              return {
                ...prevState,
                followers: data.userWhoGotFollowed.followers,
                following: data.userWhoGotFollowed.following,
              };
            });
            setShowFollow(false);
            console.log(data);
          })
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
  };

  const unFollowUser = () => {
    fetch("/user/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        unFollowingId: userId,
      }),
    })
      .then((res) =>
        res
          .json()
          .then((data) => {
            dispatch({
              type: "UPDATE",
              payload: {
                followers: data.userWhoUnFollowed.followers,
                following: data.userWhoUnFollowed.following,
              },
            });

            localStorage.setItem(
              "user",
              JSON.stringify({
                ...state,
                followers: data.userWhoUnFollowed.followers,
                following: data.userWhoUnFollowed.following,
              })
            );
            setProfile((prevState) => {
              return {
                ...prevState,
                followers: data.userWhoGotUnFollowed.followers,
                following: data.userWhoGotUnFollowed.following,
              };
            });
            setShowFollow(true);
            console.log(data);
          })
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
  };

  return (
    <>
      {profile !== null ? (
        <div style={{ maxWidth: 600, margin: "auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "30px auto",
              borderBottom: "1px solid grey",
              maxWidth: 500,
            }}
          >
            <div>
              <img
                className="profile-pic"
                src="https://tse1.mm.bing.net/th?id=OIP.0g9t2RRpr0rhAKaJPbQriQHaHk&pid=Api&P=0&h=180"
                alt="Profile pic"
              />
            </div>
            <div>
              <h5>{profile.name}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "115%",
                }}
              >
                <h6>{userPosts.length} posts</h6>
                <h6>
                  {profile.following ? profile.following.length : 0} following
                </h6>
                <h6>
                  {profile.followers ? profile.followers.length : 0} followers
                </h6>
              </div>
              <div>
                {showFollow ? (
                  <button className="btn" onClick={() => followUser()}>
                    Follow
                  </button>
                ) : (
                  <button className="btn" onClick={() => unFollowUser()}>
                    Unfollow
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="photo-gallery">
            {userPosts.map((post) => {
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
        <h1>Loading.....</h1>
      )}
    </>
  );
};

export default UserProfile;
