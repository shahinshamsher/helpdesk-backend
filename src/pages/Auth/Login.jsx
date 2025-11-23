import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../../api/api";
import { saveToken } from "../../utils/auth";
import "../../styles/auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", { email, password });
      saveToken(res.data.token);
      alert("Login successful!");
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow-lg p-4 rounded-4">
        <h3 className="text-center fw-bold text-primary mb-3">Helpdesk CRM</h3>
        <h5 className="text-center text-dark mb-4">Login to Your Account</h5>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>

          <button className="btn btn-primary w-100 py-2 mt-2">Login</button>

          <p className="text-center mt-3 mb-0">
            Don’t have an account?{" "}
            <Link to="/register" className="text-decoration-none text-primary">
              Register here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
