import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../../App";
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpform, setOtpForm] = useState(false);
  const [otp, setOtp] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const postData = () => {
    console.log("inside");
    var filter =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!filter.test(email)) {
      M.toast({ html: "Provide valid Email", classes: "#f44336 red" });
      return;
    }
    fetch("/auth/sendOtp", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
              M.toast({
                html: data.msg,
                classes: "#43a047 green darken-1",
              });
              setOtpForm(true);
            }
          })
          .catch((err) => {
            console.log(err);
          })
      )
      .catch((err) => console.log(err));
  };

  const changePassword = () => {
    fetch("/auth/resetpassword", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        password,
        otp,
      }),
    })
      .then((res) =>
        res
          .json()
          .then((data) => {
            console.log(data);
            if (data.error) {
              M.toast({ html: data.error, classes: "#c62828 red darken-3" });
            } else {
              M.toast({ html: data.msg, classes: "#2e7d32 green darken-3" });
              navigate("/login");
            }
          })
          .catch((err) => console.log(err))
      )
      .catch((err) => {
        console.log(err);
      });
  };

  if (!state)
    return (
      <div className="mycard">
        <div className="card auth-card input-field">
          <h2>Instagram</h2>
          {!otpform ? (
            <>
              <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
              <button
                className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                onClick={() => postData()}
              >
                {" "}
                Send OTP{" "}
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              ></input>
              <input
                type="password"
                placeholder="New password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
              <button
                className="btn waves-effect waves-light #42a5f5 blue lighten-1"
                onClick={() => changePassword()}
              >
                {" "}
                Change Password{" "}
              </button>
            </>
          )}
        </div>
      </div>
    );
  else return navigate("/");
};
export default ForgotPassword;
