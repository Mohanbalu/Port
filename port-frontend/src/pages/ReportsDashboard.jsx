import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const ReportsDashboard = () => {
  const [reports, setReports] = useState({
    containersPerVessel: null,
    feesCollected: null,
    averageClearance: null,
    systemHealth: null,
    fees: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadReports = async () => {
      setLoading(true);
      setError('');
      try {
        const [cpv, feesCollected, avgClearance, systemHealth, fees] = await Promise.all([
          api.get('/admin/reports/containers-per-vessel'),
          api.get('/admin/reports/fees-collected'),
          api.get('/admin/reports/average-clearance-time'),
          api.get('/admin/reports/system-health'),
          api.get('/admin/fees'),
        ]);

        setReports({
          containersPerVessel: cpv.data,
          feesCollected: feesCollected.data,
          averageClearance: avgClearance.data,
          systemHealth: systemHealth.data,
          fees: fees.data,
        });
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load report data');
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Reports Dashboard</h1>

      {error && (
        <div className="glass-panel" style={{ marginBottom: '16px', borderColor: 'rgba(255, 75, 75, 0.4)' }}>
          <strong style={{ color: 'var(--danger)' }}>{error}</strong>
        </div>
      )}

      <div style={{ display: 'grid', gap: '18px', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '24px' }}>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Containers</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {loading ? '-' : reports.systemHealth?.totalContainers ?? 0}
          </div>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Total Fees Collected</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {loading ? '-' : `$${Number(reports.feesCollected?.totalCollected ?? 0).toFixed(2)}`}
          </div>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Average Clearance (hours)</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {loading ? '-' : Number(reports.averageClearance?.averageClearanceTimeHours ?? 0).toFixed(2)}
          </div>
        </div>
        <div className="glass-panel">
          <h3 style={{ color: 'var(--text-muted)', marginBottom: '8px' }}>Pending Fees</h3>
          <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary-color)' }}>
            {loading ? '-' : `$${Number(reports.feesCollected?.totalPending ?? 0).toFixed(2)}`}
          </div>
        </div>
      </div>

      <div className="glass-panel" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '14px' }}>Containers Per Vessel</h3>
        <table>
          <thead>
            <tr>
              <th>Vessel</th>
              <th>Total Containers</th>
            </tr>
          </thead>
          <tbody>
            {(reports.containersPerVessel?.data || []).map((row, index) => (
              <tr key={`${row[0]}-${index}`}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
              </tr>
            ))}
            {!loading && (reports.containersPerVessel?.data || []).length === 0 && (
              <tr>
                <td colSpan="2" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No vessel aggregate data available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '14px' }}>Fee Invoices</h3>
        <table>
          <thead>
            <tr>
              <th>Invoice ID</th>
              <th>Container ID</th>
              <th>Total Amount</th>
              <th>Paid</th>
            </tr>
          </thead>
          <tbody>
            {reports.fees.map((fee) => (
              <tr key={fee.id}>
                <td>{fee.id}</td>
                <td>{fee.container?.id ?? '-'}</td>
                <td>${Number(fee.totalAmount || 0).toFixed(2)}</td>
                <td>{fee.paid ? 'YES' : 'NO'}</td>
              </tr>
            ))}
            {!loading && reports.fees.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No fees available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReportsDashboard;
