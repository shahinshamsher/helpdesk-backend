import React, { useEffect, useState } from "react";
import API from "../api/api";

import "../styles/userDashboard.css";


export default function UserDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    resolved: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const res = await API.get("/tickets/summary");
      setStats(res.data.summary);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="user-dashboard-container">

      {/* Header */}
      <h2 className="welcome-title">
        Welcome, User <span className="wave">👋</span>
      </h2>

      {/* Statistic Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <p className="stat-label">Total Tickets</p>
          <h2 className="stat-value">{stats.total}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-label">Open Tickets</p>
          <h2 className="stat-value">{stats.open}</h2>
        </div>

        <div className="stat-card">
          <p className="stat-label">Resolved</p>
          <h2 className="stat-value">{stats.resolved}</h2>
        </div>
      </div>

      {/* Ticket Overview Card */}
      <div className="overview-card">
        <h4 className="overview-title">Ticket Overview</h4>

        <div className="overview-buttons">
          <a href="/tickets" className="btn btn-outline-primary">
            View My Tickets
          </a>
          <a href="/tickets/new" className="btn btn-success">
            Raise New Ticket
          </a>
        </div>
      </div>
    </div>
  );
}

