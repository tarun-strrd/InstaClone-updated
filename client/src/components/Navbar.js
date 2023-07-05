import React, { useEffect, useRef } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "../App";
import M from "materialize-css";
import { CreatePost } from "./screens";
import { model } from "mongoose";
import { compareSync } from "bcryptjs";
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const navbarClassName = scrolled ? "navbar scrolled" : "navbar";
  const { state, dispatch } = useContext(UserContext);
  // console.log(state);\
  const modalRef = useRef(null);
  useEffect(() => {
    const modalElement = modalRef.current;
    if (modalElement) {
      M.Modal.init(modalElement);
    }
  }, [state]);

  useEffect(() => {
    const handleScroll = () => {
      ///   console.log("eeed");
      const scrollTop = window.scrollY;
      //console.log(scrollTop);
      if (scrollTop > 0) {
        //console.log("djfjf");
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const openDialog = () => {
    const modalInstance = M.Modal.getInstance(modalRef.current);
    console.log(modalInstance);
    if (modalInstance) {
      modalInstance.open();
    }
  };

  const closeDialog = () => {
    const modalInstance = M.Modal.getInstance(modalRef.current);
    if (modalInstance) {
      modalInstance.close();
    }
  };

  const navigate = useNavigate();
  const renderList = () => {
    if (state) {
      return [
        <li>
          <CreatePost modalRef={modalRef} onClose={closeDialog} />
          <Link className="link" onClick={() => openDialog()}>
            <i className="material-icons" style={{ marginRight: 8 }}>
              add_card
            </i>
            <span>Create</span>
          </Link>
        </li>,
        <li>
          <Link to="/subsposts">Following Posts</Link>
        </li>,
        <li>
          <Link to="/profile">Profile</Link>
        </li>,
        <li>
          <button
            className="btn #d50000 red accent-4 "
            onClick={() => {
              dispatch({ type: "CLEAR" });
              localStorage.clear();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li>
          <Link to="/login">Login</Link>
        </li>,
        <li>
          <Link to="/signup">Signup</Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/login"} className="brand-logo">
          Instagram
        </Link>
        <ul id="nav-mobile" className="right ">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
