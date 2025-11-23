import React, { useState } from 'react';
import API from '../../api/api';
import { useNavigate } from 'react-router-dom';

export default function TicketForm(){
  const [title,setTitle]=useState('');
  const [desc,setDesc]=useState('');
  const [priority,setPriority]=useState('low');
  const nav = useNavigate();

  async function submit(e){
    e.preventDefault();
    await API.post('/tickets', { title, description: desc, priority });
    nav('/tickets');
  }

  return (
    <div className="col-md-8">
      <h4>New Ticket</h4>
      <form onSubmit={submit}>
        <div className="mb-2"><input className="form-control" placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} required/></div>
        <div className="mb-2"><textarea className="form-control" placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} required/></div>
        <div className="mb-2">
          <select className="form-select" value={priority} onChange={e=>setPriority(e.target.value)}>
            <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
          </select>
        </div>
        <button className="btn btn-primary">Submit</button>
      </form>
    </div>
  );
}
