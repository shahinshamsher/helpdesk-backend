import React, { useEffect, useState } from 'react';
import API from '../api/api';

export default function AgentDashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function load() {
      const res = await API.get('/tickets');
      setTickets(res.data);
    }
    load();
  }, []);

  return (
    <div>
      <h3>Agent Dashboard</h3>
      <p>Tickets assigned to you:</p>
      <table className="table">
        <thead><tr><th>Title</th><th>Status</th><th>Action</th></tr></thead>
        <tbody>
          {tickets.map(t => (
            <tr key={t._id}>
              <td>{t.title}</td>
              <td>{t.status}</td>
              <td>
                <button className="btn btn-sm btn-outline-success"
                  onClick={async ()=>{
                    const newStatus = t.status === 'in_progress' ? 'resolved' : 'in_progress';
                    await API.put(`/tickets/${t._id}`, { status: newStatus });
                    const res = await API.get('/tickets');
                    setTickets(res.data);
                  }}>
                  {t.status === 'resolved' ? 'Reopen' : 'Mark Resolved'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
