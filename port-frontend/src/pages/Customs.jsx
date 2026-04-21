/* eslint-disable react-hooks/set-state-in-effect */
import { useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Customs = () => {
  const { isAdmin } = useContext(AuthContext);
  const [declarations, setDeclarations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [error, setError] = useState('');

  const [declarationForm, setDeclarationForm] = useState({
    containerId: '',
    hsCode: '',
    declaredValue: '',
  });

  const [reviewForm, setReviewForm] = useState({
    declarationId: '',
    remarks: '',
    action: 'clear',
  });

  const fetchAdminDeclarations = async (status = 'ALL') => {
    setError('');
    try {
      const endpoint = status === 'ALL'
        ? '/admin/customs/declarations'
        : `/admin/customs/declarations/filter?status=${status}`;
      const res = await api.get(endpoint);
      setDeclarations(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load customs declarations');
      setDeclarations([]);
    }
  };

  const fetchAdminSummary = async () => {
    try {
      const res = await api.get('/admin/customs/summary');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to load customs summary', err);
    }
  };

  const handleFileDeclaration = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await api.post('/customs/declaration', {
        container: { id: Number(declarationForm.containerId) },
        hsCode: declarationForm.hsCode,
        declaredValue: Number(declarationForm.declaredValue),
        status: 'PENDING',
      });

      setDeclarationForm({ containerId: '', hsCode: '', declaredValue: '' });
      if (isAdmin) {
        fetchAdminDeclarations(statusFilter);
        fetchAdminSummary();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to file declaration');
    }
  };

  const handleReviewDeclaration = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const endpoint = `/customs/declaration/${reviewForm.declarationId}/${reviewForm.action === 'clear' ? 'clear' : 'hold'}?remarks=${encodeURIComponent(reviewForm.remarks)}`;
      await api.put(endpoint);
      setReviewForm({ declarationId: '', remarks: '', action: 'clear' });
      if (isAdmin) {
        fetchAdminDeclarations(statusFilter);
        fetchAdminSummary();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update declaration status');
    }
  };

  const handleAdminFilterChange = (event) => {
    const status = event.target.value;
    setStatusFilter(status);
    fetchAdminDeclarations(status);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminDeclarations('ALL');
      fetchAdminSummary();
    }
  }, [isAdmin]);

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '18px' }}>Customs Portal</h1>

      {error && <p style={{ color: 'var(--danger)', marginBottom: '12px' }}>{error}</p>}

      <div className="glass-panel" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '12px' }}>File Customs Declaration</h3>
        <form onSubmit={handleFileDeclaration} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Container ID</label>
            <input value={declarationForm.containerId} onChange={(e) => setDeclarationForm((prev) => ({ ...prev, containerId: e.target.value }))} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>HS Code</label>
            <input value={declarationForm.hsCode} onChange={(e) => setDeclarationForm((prev) => ({ ...prev, hsCode: e.target.value }))} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Declared Value</label>
            <input type="number" value={declarationForm.declaredValue} onChange={(e) => setDeclarationForm((prev) => ({ ...prev, declaredValue: e.target.value }))} required />
          </div>
          <button className="btn" type="submit">Submit</button>
        </form>
      </div>

      {!isAdmin && (
        <div className="glass-panel" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Review Declaration</h3>
          <form onSubmit={handleReviewDeclaration} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Declaration ID</label>
              <input value={reviewForm.declarationId} onChange={(e) => setReviewForm((prev) => ({ ...prev, declarationId: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Action</label>
              <select value={reviewForm.action} onChange={(e) => setReviewForm((prev) => ({ ...prev, action: e.target.value }))}>
                <option value="clear">CLEAR</option>
                <option value="hold">HOLD</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Remarks</label>
              <input value={reviewForm.remarks} onChange={(e) => setReviewForm((prev) => ({ ...prev, remarks: e.target.value }))} />
            </div>
            <button className="btn" type="submit">Update</button>
          </form>
        </div>
      )}

      {isAdmin && (
        <>
          <div className="glass-panel" style={{ marginBottom: '20px' }}>
            <h3 style={{ marginBottom: '12px' }}>Customs Summary</h3>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              <div>Total: <strong>{summary?.total ?? 0}</strong></div>
              <div>Pending: <strong>{summary?.pending ?? 0}</strong></div>
              <div>Cleared: <strong>{summary?.cleared ?? 0}</strong></div>
              <div>Held: <strong>{summary?.held ?? 0}</strong></div>
            </div>
          </div>

          <div className="glass-panel" style={{ marginBottom: '20px' }}>
            <div style={{ maxWidth: '220px' }}>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Filter by Status</label>
              <select value={statusFilter} onChange={handleAdminFilterChange}>
                <option value="ALL">ALL</option>
                <option value="PENDING">PENDING</option>
                <option value="CLEARED">CLEARED</option>
                <option value="HELD">HELD</option>
              </select>
            </div>
          </div>
        </>
      )}

      <div className="glass-panel">
        <table>
          <thead>
            <tr>
              <th>Declaration ID</th>
              <th>Container ID</th>
              <th>HS Code</th>
              <th>Declared Value</th>
              <th>Status</th>
              <th>Reviewed By</th>
            </tr>
          </thead>
          <tbody>
            {declarations.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>#{d.id}</td>
                <td>{d.container?.id || '-'}</td>
                <td>{d.hsCode}</td>
                <td>${d.declaredValue.toLocaleString()}</td>
                <td>
                  <span className={`status-badge status-${d.status}`}>{d.status}</span>
                </td>
                <td>{d.reviewedBy?.username || '-'}</td>
              </tr>
            ))}
            {declarations.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  {isAdmin ? 'No customs declarations found.' : 'Declaration list is available in Admin view.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customs;
