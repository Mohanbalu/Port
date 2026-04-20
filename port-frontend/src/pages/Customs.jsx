import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';

const Customs = () => {
  const [declarations, setDeclarations] = useState([]);

  useEffect(() => {
    // In a real app we'd fetch actual customs, here we'll assume an endpoint exists
    // api.get('/customs/declaration').then(res => setDeclarations(res.data));
    setDeclarations([
      { id: 1, containerNumber: 'MSKU1234567', hsCode: '847130', status: 'UNDER_REVIEW', declaredValue: 50000 },
      { id: 2, containerNumber: 'CMAU7654321', hsCode: '100190', status: 'CLEARED', declaredValue: 12000 }
    ]);
  }, []);

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Customs Portal 🏛️</h1>
      
      <div className="glass-panel">
        <table>
          <thead>
            <tr>
              <th>Declaration ID</th>
              <th>Container Number</th>
              <th>HS Code</th>
              <th>Declared Value</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {declarations.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>#{d.id}</td>
                <td>{d.containerNumber}</td>
                <td>{d.hsCode}</td>
                <td>${d.declaredValue.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${d.status}`}>{d.status}</span>
                </td>
                <td>
                    {d.status === 'UNDER_REVIEW' && (
                       <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>Clear Item</button>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customs;
