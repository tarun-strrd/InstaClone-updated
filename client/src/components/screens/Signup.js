import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [url, setUrl] = useState(undefined);
  const [image, setImage] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (url !== "") {
      console.log(url);
      uploadFeilds();
    }
  }, [url]);

  const uploadPic = () => {
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

  const uploadFeilds = () => {
    var filter =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email)) {
      M.toast({ html: "Provide valid Email", classes: "#f44336 red" });
      return;
    }
    fetch("http://localhost:5000/auth/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email,
        url,
      }),
    })
      .then((res) =>
        res
          .json()
          .then((data) => {
            if (data.error) {
              M.toast({ html: data.error, classes: "#f44336 red" });
            } else {
              M.toast({ html: data.msg, classes: "#43a047 green darken-1" });
              navigate("/login");
            }
          })
          .catch((err) => {
            console.log(err);
          })
      )
      .catch((err) => console.log(err));
  };

  const postData = () => {
    if (image !== "") {
      uploadPic();
    } else {
      uploadFeilds();
    }
  };

  return (
    <div className="my-card">
      <div className="card auth-card">
        <h2>Instagram</h2>
        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="file-field input-field">
          <div className="btn">
            <span>Upload Profile Picture</span>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>
        <button
          className="btn"
          type="submit"
          name="action"
          onClick={() => postData()}
        >
          Signup
        </button>
        <h6 style={{ fontSize: 12 }}>
          <Link to="/login">Already have an account?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Signup;
