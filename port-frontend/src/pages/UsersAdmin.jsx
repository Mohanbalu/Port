import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const roleOptions = [
  'ADMIN',
  'SHIPPING_LINE',
  'FREIGHT_FORWARDER',
  'CUSTOMS_OFFICER',
  'TRUCKING_COMPANY',
  'WAREHOUSE_OPERATOR',
];

const UsersAdmin = () => {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ username: '', email: '', password: '', role: 'SHIPPING_LINE' });
  const [creating, setCreating] = useState(false);

  const fetchUsers = async (selectedRole = roleFilter) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = selectedRole === 'ALL' ? '/admin/users' : `/admin/users?role=${selectedRole}`;
      const res = await api.get(endpoint);
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    api.get('/admin/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to fetch users');
        setUsers([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleFilterChange = (event) => {
    const selectedRole = event.target.value;
    setRoleFilter(selectedRole);
    fetchUsers(selectedRole);
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError('');
    try {
      await api.post('/admin/users', form);
      setForm({ username: '', email: '', password: '', role: 'SHIPPING_LINE' });
      fetchUsers(roleFilter);
    } catch (err) {
      setError(err.response?.data?.error || 'User creation failed');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>User Management</h1>

      {error && (
        <div className="glass-panel" style={{ marginBottom: '16px', borderColor: 'rgba(255, 75, 75, 0.4)' }}>
          <strong style={{ color: 'var(--danger)' }}>{error}</strong>
        </div>
      )}

      <div style={{ display: 'grid', gap: '20px', gridTemplateColumns: '1fr 1.4fr' }}>
        <div className="glass-panel">
          <h3 style={{ marginBottom: '14px' }}>Create User</h3>
          <form onSubmit={handleCreateUser}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Username</label>
              <input
                value={form.username}
                onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Role</label>
              <select
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              >
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            <button className="btn" type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create User'}
            </button>
          </form>
        </div>

        <div className="glass-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h3>All Users</h3>
            <div style={{ width: '220px' }}>
              <select value={roleFilter} onChange={handleFilterChange}>
                <option value="ALL">All Roles</option>
                {roleOptions.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Loading users...</td>
                </tr>
              )}
              {!loading && users.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td>
                </tr>
              )}
              {!loading && users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersAdmin;
