
import React from 'react';
import { getUserFromToken } from '../utils/auth';
import UserDashboard from './UserDashboard';
import AgentDashboard from './AgentDashboard';
import AdminDashboard from './Admin/AdminDashboard';

export default function Dashboard() {
  const user = getUserFromToken();

  if (!user) return <div>Please log in</div>;

  if (user.role === 'admin') return <AdminDashboard />;
  if (user.role === 'agent') return <AgentDashboard />;
  return <UserDashboard />;
}
