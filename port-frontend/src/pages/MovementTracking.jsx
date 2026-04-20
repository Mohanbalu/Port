import React, { useState } from 'react';
import api from '../api/axiosConfig';

const MovementTracking = () => {
  const [containerId, setContainerId] = useState('');
  const [logs, setLogs] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!containerId) return;
    try {
      const res = await api.get(`/movement-logs/container/${containerId}`);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      setLogs([]);
    }
  };

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Movement Tracking 📍</h1>
      
      <div className="glass-panel" style={{ marginBottom: '24px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '16px', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-muted)' }}>Search by Container Database ID</label>
            <input 
              type="text" 
              value={containerId} 
              onChange={(e) => setContainerId(e.target.value)} 
              placeholder="e.g. 1" 
            />
          </div>
          <button type="submit" className="btn">Track Lifecycle</button>
        </form>
      </div>

      {logs.length > 0 && (
        <div className="glass-panel animate-fade-in">
          <h3 style={{ marginBottom: '16px' }}>Lifecycle Timeline</h3>
          <div style={{ borderLeft: '2px solid var(--panel-border)', paddingLeft: '24px', marginLeft: '12px' }}>
            {logs.map((log) => (
              <div key={log.id} style={{ position: 'relative', marginBottom: '24px' }}>
                <div style={{ 
                  position: 'absolute', left: '-31px', top: '0', 
                  width: '12px', height: '12px', borderRadius: '50%', 
                  background: 'var(--primary-color)', boxShadow: '0 0 10px var(--primary-color)' 
                }} />
                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '4px' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{log.status}</div>
                <div style={{ color: 'var(--success)' }}>Location: {log.location}</div>
                <div style={{ color: 'var(--text-active)' }}>{log.remarks}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovementTracking;
