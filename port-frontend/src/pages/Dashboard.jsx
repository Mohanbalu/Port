import React, { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const Dashboard = () => {
  const [stats, setStats] = useState({ containers: 0, movements: 0 });

  useEffect(() => {
    api.get('/containers').then(res => {
        setStats(prev => ({ ...prev, containers: res.data.length }));
    }).catch(err => console.error(err));
  }, []);

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Dashboard</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        <div className="glass-panel">
           <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Registered Containers</h3>
           <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)' }}>{stats.containers}</div>
        </div>
        <div className="glass-panel">
           <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Port Status</h3>
           <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>Operational</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
