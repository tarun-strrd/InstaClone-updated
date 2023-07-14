import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";

const Login = () => {
  const { state, dispatch } = useContext(UserContext);
  //console.log(contextValue);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const postData = () => {
    var filter =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email)) {
      M.toast({ html: "Provide valid Email", classes: "#f44336 red" });
      return;
    }
    fetch("https://insta-clone-api.vercel.app/auth/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) =>
        res
          .json()
          .then((data) => {
            console.log(data);
            if (data.error) {
              M.toast({ html: data.error, classes: "#f44336 red" });
            } else {
              localStorage.setItem("token", data.token);
              localStorage.setItem("user", JSON.stringify(data.user));
              dispatch({ type: "USER", payload: data.user });
              M.toast({
                html: "SignIn successfil",
                classes: "#43a047 green darken-1",
              });
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
          })
      )
      .catch((err) => console.log(err));
  };
  return (
    <div className="my-card">
      <div className="card auth-card">
        <h2 style={{ fontFamily: "Grand Hotel" }}>Instagram</h2>
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
        <button
          className="btn"
          type="submit"
          name="action"
          onClick={() => postData()}
        >
          Login
        </button>
        <h6 style={{ fontSize: 12 }}>
          <Link to="/signup">New to Instagram? Signup here..</Link>
        </h6>
        <h6 style={{ fontSize: 12 }}>
          <Link to="/forgot-password">forgot password?</Link>
        </h6>
      </div>
    </div>
  );
};

export default Login;
