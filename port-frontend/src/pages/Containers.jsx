import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Containers = () => {
  const [containers, setContainers] = useState([]);

  useEffect(() => {
    fetchContainers();
  }, []);

  const fetchContainers = async () => {
    try {
      const res = await api.get('/containers');
      setContainers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Container Management</h1>
      
      <div className="glass-panel">
        <table>
          <thead>
            <tr>
              <th>Container Number</th>
              <th>Status</th>
              <th>Size</th>
              <th>Weight (kg)</th>
              <th>Arrival Date</th>
            </tr>
          </thead>
          <tbody>
            {containers.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.containerNumber}</td>
                <td>
                  <span className={`status-badge status-${c.status}`}>{c.status}</span>
                </td>
                <td>{c.size}</td>
                <td>{c.weight}</td>
                <td>{new Date(c.arrivalDate).toLocaleDateString()}</td>
              </tr>
            ))}
            {containers.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No containers found. Use the backend API simulation to dock some!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Containers;
