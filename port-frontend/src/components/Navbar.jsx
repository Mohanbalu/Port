import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', margin: '24px', borderRadius: '12px' }}>
      <div className="gradient-text" style={{ fontSize: '1.5rem', textDecoration: 'none' }}>
        <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Port Logistics</Link>
      </div>
      <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Dashboard</Link>
        <Link to="/containers" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Containers</Link>
        <Link to="/customs" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Customs</Link>
        <Link to="/tracking" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontWeight: '500' }}>Tracking</Link>
        <div style={{ color: 'var(--primary-color)', fontWeight: '600', marginLeft: '16px' }}>{user.username}</div>
        <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
