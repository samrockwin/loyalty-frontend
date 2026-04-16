import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="NextGen Tyres Logo" />
          <span>NextGen Tyres Loyalty</span>
        </Link>
        <div>
          {user ? (
            <div className="flex items-center gap-4 navbar-user">
              <span className="navbar-welcome">Welcome, {user.name}</span>
              <div className="navbar-actions">
                <button onClick={handleLogout} className="btn btn-danger">
                  Logout
                </button>
                <button onClick={() => navigate("/history")} className="btn btn-secondary">
                  History
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-4">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
