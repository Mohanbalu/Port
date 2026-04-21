import { useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Vessels = () => {
  const { role } = useContext(AuthContext);
  const canManageVessels = role === 'ADMIN' || role === 'SHIPPING_LINE';
  const [vessels, setVessels] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [vesselForm, setVesselForm] = useState({
    name: '',
    imoNumber: '',
    capacity: '',
  });

  const [scheduleForm, setScheduleForm] = useState({
    vesselId: '',
    arrivalTime: '',
    departureTime: '',
    status: 'SCHEDULED',
  });

  const [statusForm, setStatusForm] = useState({
    scheduleId: '',
    status: 'ARRIVED',
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setError('');
      try {
        const [vesselRes, scheduleRes] = await Promise.all([api.get('/vessels'), api.get('/vessels/schedules')]);
        setVessels(vesselRes.data);
        setSchedules(scheduleRes.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load vessel data');
      }
    };

    loadData();
  }, []);

  const refreshData = async () => {
    const [vesselRes, scheduleRes] = await Promise.all([api.get('/vessels'), api.get('/vessels/schedules')]);
    setVessels(vesselRes.data);
    setSchedules(scheduleRes.data);
  };

  const handleCreateVessel = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/vessels', {
        name: vesselForm.name,
        imoNumber: vesselForm.imoNumber,
        capacity: Number(vesselForm.capacity),
      });
      setSuccess('Vessel created successfully.');
      setVesselForm({ name: '', imoNumber: '', capacity: '' });
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create vessel');
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSchedule = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.post('/vessel-schedules', {
        vessel: { id: Number(scheduleForm.vesselId) },
        arrivalTime: scheduleForm.arrivalTime,
        departureTime: scheduleForm.departureTime,
        status: scheduleForm.status,
      });
      setSuccess('Schedule created successfully.');
      setScheduleForm({ vesselId: '', arrivalTime: '', departureTime: '', status: 'SCHEDULED' });
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create vessel schedule');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateScheduleStatus = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await api.put(`/vessel-schedules/${statusForm.scheduleId}/status`, null, {
        params: { status: statusForm.status },
      });
      setSuccess('Schedule status updated successfully.');
      setStatusForm({ scheduleId: '', status: 'ARRIVED' });
      await refreshData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update schedule status');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Vessels & Schedules</h1>
      {error && <p style={{ color: 'var(--danger)', marginBottom: '14px' }}>{error}</p>}
      {success && <p style={{ color: 'var(--success)', marginBottom: '14px' }}>{success}</p>}

      {canManageVessels && (
        <div className="glass-panel" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Create Vessel</h3>
          <form onSubmit={handleCreateVessel} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Vessel Name</label>
              <input value={vesselForm.name} onChange={(e) => setVesselForm((prev) => ({ ...prev, name: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>IMO Number</label>
              <input value={vesselForm.imoNumber} onChange={(e) => setVesselForm((prev) => ({ ...prev, imoNumber: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Capacity</label>
              <input type="number" min="1" value={vesselForm.capacity} onChange={(e) => setVesselForm((prev) => ({ ...prev, capacity: e.target.value }))} required />
            </div>
            <button className="btn" type="submit" disabled={saving} style={{ gridColumn: '1 / 2' }}>
              {saving ? 'Saving...' : 'Create Vessel'}
            </button>
          </form>

          <h3 style={{ marginBottom: '12px' }}>Create Schedule</h3>
          <form onSubmit={handleCreateSchedule} style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', alignItems: 'end', marginBottom: '18px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Vessel ID</label>
              <input value={scheduleForm.vesselId} onChange={(e) => setScheduleForm((prev) => ({ ...prev, vesselId: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Arrival Time</label>
              <input type="datetime-local" value={scheduleForm.arrivalTime} onChange={(e) => setScheduleForm((prev) => ({ ...prev, arrivalTime: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Departure Time</label>
              <input type="datetime-local" value={scheduleForm.departureTime} onChange={(e) => setScheduleForm((prev) => ({ ...prev, departureTime: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Status</label>
              <select value={scheduleForm.status} onChange={(e) => setScheduleForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="ARRIVED">ARRIVED</option>
                <option value="DEPARTED">DEPARTED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
            <button className="btn" type="submit" disabled={saving} style={{ gridColumn: '1 / 2' }}>
              {saving ? 'Saving...' : 'Create Schedule'}
            </button>
          </form>

          <h3 style={{ marginBottom: '12px' }}>Update Schedule Status</h3>
          <form onSubmit={handleUpdateScheduleStatus} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Schedule ID</label>
              <input value={statusForm.scheduleId} onChange={(e) => setStatusForm((prev) => ({ ...prev, scheduleId: e.target.value }))} required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Status</label>
              <select value={statusForm.status} onChange={(e) => setStatusForm((prev) => ({ ...prev, status: e.target.value }))}>
                <option value="ARRIVED">ARRIVED</option>
                <option value="DEPARTED">DEPARTED</option>
                <option value="CANCELLED">CANCELLED</option>
                <option value="SCHEDULED">SCHEDULED</option>
              </select>
            </div>
            <button className="btn" type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Update Status'}
            </button>
          </form>
        </div>
      )}

      <div className="glass-panel" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '12px' }}>Vessels</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>IMO Number</th>
              <th>Capacity</th>
            </tr>
          </thead>
          <tbody>
            {vessels.map((vessel) => (
              <tr key={vessel.id}>
                <td>{vessel.id}</td>
                <td>{vessel.name}</td>
                <td>{vessel.imoNumber}</td>
                <td>{vessel.capacity}</td>
              </tr>
            ))}
            {vessels.length === 0 && (
              <tr>
                <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No vessels available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '12px' }}>Schedules</h3>
        <table>
          <thead>
            <tr>
              <th>Schedule ID</th>
              <th>Vessel ID</th>
              <th>Arrival</th>
              <th>Departure</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {schedules.map((schedule) => (
              <tr key={schedule.id}>
                <td>{schedule.id}</td>
                <td>{schedule.vessel?.id ?? '-'}</td>
                <td>{schedule.arrivalTime ? new Date(schedule.arrivalTime).toLocaleString() : '-'}</td>
                <td>{schedule.departureTime ? new Date(schedule.departureTime).toLocaleString() : '-'}</td>
                <td>{schedule.status}</td>
              </tr>
            ))}
            {schedules.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No vessel schedules available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vessels;
