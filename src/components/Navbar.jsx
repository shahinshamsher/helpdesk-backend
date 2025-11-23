import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserFromToken, logout } from "../utils/auth";
import { ThemeContext } from "../context/ThemeContext";

export default function Navbar() {
  const user = getUserFromToken();
  const nav = useNavigate();
  const { dark, toggleTheme } = useContext(ThemeContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        
        {/* Brand */}
        <Link className="navbar-brand" to="/">Help Desk</Link>

        <div className="collapse navbar-collapse">
          
          {/* Left Menu */}
          <ul className="navbar-nav me-auto">
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>

                <li className="nav-item">
                  <Link className="nav-link" to="/tickets">Tickets</Link>
                </li>

                {user.role === "admin" && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          {/* Right Menu */}
          <ul className="navbar-nav align-items-center">

            {/* THEME TOGGLE BUTTON HERE */}
            <li className="nav-item me-3">
              <button 
                onClick={toggleTheme} 
                className="btn btn-light btn-sm"
                style={{ borderRadius: "50%", width: 34, height: 34 }}
              >
                {dark ? "☀️" : "🌙"}
              </button>
            </li>

            {!user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <span className="navbar-text text-light me-3">
                  Hi, {user.name}
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={() => {
                    logout();
                    nav("/login");
                  }}
                >
                  Logout
                </button>
              </>
            )}
          </ul>
        </div>

      </div>
    </nav>
  );
}
