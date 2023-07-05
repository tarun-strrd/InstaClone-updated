import "./App.css";
import Navbar from "./components/Navbar";
import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import React, { useEffect, createContext, useReducer, useContext } from "react";
import {
  Home,
  Login,
  Profile,
  Signup,
  CreatePost,
  UserProfile,
  SubsPosts,
  ForgotPassword,
} from "./components/screens/index";
import { reducer } from "./reducers/userReducer";
import "materialize-css/dist/css/materialize.min.css";
import M from "materialize-css";

// Initialize Materialize components
document.addEventListener("DOMContentLoaded", function () {
  M.AutoInit();
});

const Routing = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate("/login");
    }
  }, []);
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/subsposts" element={<SubsPosts />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create" element={<CreatePost />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route exact path="/profile/:userId" element={<UserProfile />} />
      <Route path="*" element={<h1>NOT FOUND</h1>} />
    </Routes>
  );
};
export const UserContext = createContext();
function App() {
  const [state, dispatch] = useReducer(reducer, null);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
