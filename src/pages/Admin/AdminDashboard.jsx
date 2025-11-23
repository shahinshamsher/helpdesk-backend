import React, { useEffect, useState } from "react";
import API from "../../api/api";
import {
  Card,
  Row,
  Col,
  Table,
  Form,
  Spinner,
  Alert,
} from "react-bootstrap";
import "../../styles/admin.css";

export default function AdminDashboard() {
  const [agents, setAgents] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({ active: 0, solved: 0, assigned: 0 });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  async function load() {
    try {
      setLoading(true);
      const [resAgents, resTickets, resSummary] = await Promise.all([
        API.get("/admin/agents"),
        API.get("/tickets"),
        API.get("/tickets/summary"),
      ]);
      setAgents(resAgents.data);
      setTickets(resTickets.data);
      setStats(resSummary.data.summary);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAssign(ticketId, agentId) {
    if (!agentId) return;

    try {
      const res = await API.post("/admin/assign", { ticketId, agentId });
      setMsg(res.data.message || "Agent assigned successfully!");
      setTimeout(() => setMsg(""), 2000);
      load();
    } catch (err) {
      console.error(err);
      setMsg("Failed to assign agent!");
    }
  }

  if (loading) {
    return (
      <div className="center-loading">
        <Spinner animation="border" variant="primary" />
        <p>Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="admin-container">

      <h2 className="mb-4 fw-bold admin-title">Admin Dashboard</h2>

      {msg && <Alert variant="info">{msg}</Alert>}

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="summary-card shadow-sm">
            <Card.Body>
              <h6>Active Tickets</h6>
              <h2 className="count orange">{stats.active}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="summary-card shadow-sm">
            <Card.Body>
              <h6>Resolved Tickets</h6>
              <h2 className="count green">{stats.solved}</h2>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="summary-card shadow-sm">
            <Card.Body>
              <h6>Assigned</h6>
              <h2 className="count blue">{stats.assigned}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Ticket Table */}
      <Card className="shadow-sm border-0 mb-4 p-3">
        <h5 className="fw-semibold mb-3">All Tickets</h5>
        <Table hover responsive className="ticket-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Owner</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Assign</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t._id}>
                <td>{t.title}</td>
                <td>{t.ownerName}</td>
                <td>
                  <span className={`priority ${t.priority || "low"}`}>
                    {t.priority}
                  </span>
                </td>
                <td>{t.assignedToName || "-"}</td>
                <td>
                  <span className={`badge status-${t.status}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <Form.Select
                    size="sm"
                    onChange={(e) =>
                      handleAssign(t._id, e.target.value)
                    }
                  >
                    <option>Select Agent</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </Form.Select>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Agent List */}
      <Card className="shadow-sm border-0 p-3 mb-4">
        <h5 className="fw-semibold mb-3">Available Agents</h5>

        <Row>
          {agents.map((a) => (
            <Col md={4} key={a._id}>
              <Card className="agent-card shadow-sm p-3 mb-3">
                <div className="agent-avatar">{a.name[0]}</div>
                <h6 className="fw-bold">{a.name}</h6>
                <p className="text-muted">{a.email}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}



