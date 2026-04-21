import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

const AdminDashboard = () => {
  const [health, setHealth] = useState(null);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [healthRes, usersRes] = await Promise.all([
          api.get('/admin/reports/system-health'),
          api.get('/admin/users'),
        ]);

        setHealth(healthRes.data);
        setUsersCount(usersRes.data.length);
      } catch (error) {
        console.error('Failed to load admin dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>
        Admin Dashboard
      </h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '28px' }}>
        User Management, System Monitoring, and Reports in one place.
      </p>

      <div style={{ display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Users</h3>
          <div style={{ fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 700 }}>
            {loading ? '-' : usersCount}
          </div>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Containers</h3>
          <div style={{ fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 700 }}>
            {loading ? '-' : health?.totalContainers ?? 0}
          </div>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Declarations</h3>
          <div style={{ fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 700 }}>
            {loading ? '-' : health?.totalCustomsDeclarations ?? 0}
          </div>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Fees Collected</h3>
          <div style={{ fontSize: '2rem', color: 'var(--primary-color)', fontWeight: 700 }}>
            {loading ? '-' : `$${Number(health?.totalFeesCollected ?? 0).toFixed(2)}`}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        <div className="glass-panel">
          <h3 style={{ marginBottom: '8px' }}>User Management</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Create users and filter users by role.
          </p>
          <Link className="btn" style={{ textDecoration: 'none', display: 'inline-block' }} to="/admin/users">
            Go to Users
          </Link>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '8px' }}>System Monitoring</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            Monitor containers, vessels, customs, movement logs and fees.
          </p>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link className="btn btn-secondary" style={{ textDecoration: 'none' }} to="/containers">Containers</Link>
            <Link className="btn btn-secondary" style={{ textDecoration: 'none' }} to="/vessels">Vessels</Link>
            <Link className="btn btn-secondary" style={{ textDecoration: 'none' }} to="/customs">Customs</Link>
            <Link className="btn btn-secondary" style={{ textDecoration: 'none' }} to="/tracking">Movement</Link>
          </div>
        </div>

        <div className="glass-panel">
          <h3 style={{ marginBottom: '8px' }}>Reports</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '16px' }}>
            View aggregate reports and fee invoices.
          </p>
          <Link className="btn" style={{ textDecoration: 'none', display: 'inline-block' }} to="/admin/reports">
            Open Reports
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
