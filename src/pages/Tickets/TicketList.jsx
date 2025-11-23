import React, { useEffect, useState } from 'react';
import API from '../../api/api';
import { Link } from 'react-router-dom';
import { getUserFromToken } from '../../utils/auth';

export default function TicketList() {
  const user = getUserFromToken();
  const [tickets, setTickets] = useState([]);
  const [agents, setAgents] = useState([]); // store agent list for admin
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');

  async function load() {
    const res = await API.get('/tickets', { params: { q, status } });
    setTickets(res.data);

    // if admin, fetch agent list
    if (user.role === 'admin') {
      const ag = await API.get('/admin/agents');
      setAgents(ag.data);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // function for admin to assign agent
  async function handleAssign(ticketId, agentId) {
    if (!agentId) return;
    await API.post('/admin/assign', { ticketId, agentId });
    load();
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4>Tickets</h4>

        {/* Show "New Ticket" only for normal users */}
        {user.role === 'user' && (
          <Link className="btn btn-primary" to="/tickets/new">
            New Ticket
          </Link>
        )}
      </div>

      {/* Search and Filter */}
      <div className="row mb-3">
        <div className="col-md-5">
          <input
            className="form-control"
            placeholder="Search by title or description"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="withdrawn">Withdrawn</option>
          </select>
        </div>
        <div className="col-md-2">
          <button className="btn btn-secondary" onClick={load}>
            Filter
          </button>
        </div>
      </div>

      {/* Tickets Table */}
      <table className="table table-striped align-middle">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Owner</th>
            <th>Agent</th>
            <th>Status</th>
            <th style={{ width: '220px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => (
            <tr key={t._id}>
              <td>{t.title}</td>
              <td>{t.ownerName}</td>
              <td>{t.assignedToName || '-'}</td>
              <td>
                <span
                  className={`badge ${
                    t.status === 'resolved'
                      ? 'bg-success'
                      : t.status === 'in_progress'
                      ? 'bg-info'
                      : t.status === 'withdrawn'
                      ? 'bg-secondary'
                      : 'bg-warning text-dark'
                  }`}
                >
                  {t.status}
                </span>
              </td>
              <td>
                <Link
                  className="btn btn-sm btn-outline-primary me-2"
                  to={`/tickets/${t._id}`}
                >
                  View
                </Link>

                {/* Admin role: show dropdown to assign */}
                {user.role === 'admin' && (
                  <select
                    className="form-select form-select-sm d-inline-block w-auto"
                    onChange={(e) => handleAssign(t._id, e.target.value)}
                    defaultValue=""
                  >
                    <option value="">Assign Agent</option>
                    {agents.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                )}

                {/* Agent role: show change status button */}
                {user.role === 'agent' && (
                  <button
                    className="btn btn-sm btn-outline-success ms-2"
                    onClick={async () => {
                      const newStatus =
                        t.status === 'in_progress' ? 'resolved' : 'in_progress';
                      await API.put(`/tickets/${t._id}`, { status: newStatus });
                      load();
                    }}
                  >
                    {t.status === 'resolved'
                      ? 'Reopen'
                      : 'Mark as Resolved'}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {tickets.length === 0 && (
        <div className="alert alert-info text-center">No tickets found.</div>
      )}
    </div>
  );
}

