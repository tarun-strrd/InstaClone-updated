import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import M from "materialize-css";

function CreatePost({ modalRef, onClose }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");
  const fileInputRef = useRef(null);
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
      fetch("http://localhost:5000/post/createpost", {
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
            onClose();
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

  const openFileInput = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };
  return (
    <div id="create-post-modal" ref={modalRef} className="modal">
      <div className="modal-content">
        <h4 style={{ color: "black" }}>Create Post</h4>
        <div style={{ textAlign: "center" }}>
          {
            <div>
              <div>
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
                    <span onClick={openFileInput} ref={fileInputRef}>
                      Upload Image
                    </span>
                    <input type="file" onChange={handleImageUpload} />
                  </div>
                  <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                  </div>
                </div>
                <div style={{ display: "flex" }}>
                  <button
                    className="btn #1e88e5 blue darken-1"
                    name="action"
                    onClick={() => postSubmit()}
                  >
                    post{" "}
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
      <div className="modal-footer">
        <button
          style={{
            borderColor: "#f45757",
            border: "solid",
            borderRadius: 5,
          }}
          className="modal-close waves-effect waves-green btn-flat"
          onClick={onClose}
        >
          Discard
        </button>
      </div>
    </div>
  );
}

export default CreatePost;
