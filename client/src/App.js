import logo from "./logo.svg";
import "./App.css";
import SignUp from "./components/SignUp.js";
import AddMissing from "./components/AddMissing.js";
import AddCriminal from "./components/AddCriminal.js";
import Login from "./components/Login.js";
import Menu from "./components/Menu.js";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Criminal from "./components/Criminal.js";
import Profile from "./components/Profile.js";
import Missing from "./components/Missing.js";
import Home from "./components/Home.js";
import Button from "react-bootstrap/Button";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  //For SignOut
  const signUserOut = () => {
    localStorage.clear();
    setToken(false);
    window.location.pathname = "/Login";
  };

  return (
    <div className="App">
      <Router>
      {/* Setting Routes */}
        <nav>
          {!token ? (
            <>
              <Link to="/SignUp"> SignUp </Link>
              <Link to="/Login"> Login </Link>
            </>
          ) : (
            <>
              <Link to="/Menu"> Menu </Link>
              <Link to="/Missing"> Find Missing </Link>
              <Link to="/Criminal"> Find Criminal </Link>
              <Link to="/Profile"> Edit Profile </Link>
              <Button onClick={signUserOut}> Log Out</Button>
            </>
          )}
        </nav>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="SignUp" element={<SignUp setToken={setToken} />} />
          <Route
            exact
            path="AddMissing"
            element={<AddMissing token={token} />}
          />
          <Route
            exact
            path="AddCriminal"
            element={<AddCriminal token={token} />}
          />
          <Route path="/Login" element={<Login setToken={setToken} />} />
          <Route
            exact
            path="/Menu"
            element={<Menu token={token} />}
          />
          <Route exact path="/Missing" element={<Missing token={token} />} />
          <Route exact path="/Criminal" element={<Criminal token={token} />} />
          <Route exact path="/Profile" element={<Profile token={token} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
