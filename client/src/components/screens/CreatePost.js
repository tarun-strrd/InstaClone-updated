import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import M from "materialize-css";

function CreatePost() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (url !== "") {
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        `Bearer ${localStorage.getItem("token")}`
      );

      //console.log([...headers.entries()]);
      fetch("/post/createpost", {
        method: "post",
        headers: headers,
        body: JSON.stringify({
          title,
          description,
          pic: url,
        }),
      }).then((res) =>
        res.json().then((data) => {
          console.log(data);
          if (data.error) {
            M.toast({ html: data.error, classes: "#f44336 red" });
          } else {
            M.toast({ html: "Posted Succesffuly", classes: "#4caf50 green" });
            navigate("/");
          }
        })
      );
    }
  }, [url]);

  const postSubmit = () => {
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
          .then((data) => setUrl(data.url))
          .catch((err) => console.log(err))
      )
      .catch((err) => console.log(err));
  };

  const handleCreatePostClick = () => {
    setIsPopupOpen((prev) => {
      return !prev;
    });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <button
        onClick={handleCreatePostClick}
        className="btn"
        style={{ margin: 200 }}
      >
        Something on mind...<i className="material-icons">mood</i>
      </button>
      {isPopupOpen && (
        <div className="overlay">
          <div className="popup">
            <input
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="file-field input-field">
              <div className="btn">
                <span>Upload Image</span>
                <input
                  type="file"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </div>
              <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <button
                className="btn #1e88e5 blue darken-1"
                name="action"
                onClick={handleCreatePostClick}
              >
                cancel
              </button>
              <button
                className="btn #1e88e5 blue darken-1"
                name="action"
                onClick={() => postSubmit()}
              >
                post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreatePost;
