/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useContext, useEffect, useState } from 'react';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';

const Containers = () => {
  const { isAdmin, role, user } = useContext(AuthContext);
  const [containers, setContainers] = useState([]);
  const [selectedContainerId, setSelectedContainerId] = useState(null);
  const [journeyLogs, setJourneyLogs] = useState([]);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [createForm, setCreateForm] = useState({
    containerNumber: '',
    containerType: 'STANDARD',
    sizeTEU: '20',
    sealNumber: '',
    cargoDescription: '',
    weightKG: '',
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createSuccess, setCreateSuccess] = useState('');
  const [createError, setCreateError] = useState('');

  const fetchContainers = useCallback(async () => {
    try {
      const endpoint = isAdmin ? '/admin/containers' : '/containers';
      const res = await api.get(endpoint);
      setContainers(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [isAdmin]);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  const handleCreateContainer = async (event) => {
    event.preventDefault();
    setCreateLoading(true);
    setCreateSuccess('');
    setCreateError('');

    const containerNumber = createForm.containerNumber.trim();
    const isValidContainer = /^[A-Z]{4}[0-9]{7}$/.test(containerNumber);

    if (!isValidContainer) {
      setCreateLoading(false);
      setCreateError('Container number must be 4 uppercase letters followed by 7 digits (e.g., MSCU1234567)');
      return;
    }

    const payload = {
      containerNumber,
      // Backend stores the existing container schema. These UI fields are mapped to it.
      size: `${createForm.sizeTEU} TEU`,
      weight: Number(createForm.weightKG),
      containerType: createForm.containerType,
      sealNumber: createForm.sealNumber,
      cargoDescription: createForm.cargoDescription,
      sizeTEU: Number(createForm.sizeTEU),
    };

    try {
      await api.post('/containers', payload, {
        headers: user?.token ? { Authorization: `Bearer ${user.token}` } : undefined,
      });
      setCreateForm({
        containerNumber: '',
        containerType: 'STANDARD',
        sizeTEU: '20',
        sealNumber: '',
        cargoDescription: '',
        weightKG: '',
      });
      setCreateSuccess('Container created successfully.');
      await fetchContainers();
    } catch (err) {
      setCreateSuccess('');
      setCreateError(err.response?.data?.error || err.response?.data?.message || 'Failed to create container');
    } finally {
      setCreateLoading(false);
    }
  };

  const viewJourney = async (containerId) => {
    setJourneyLoading(true);
    setSelectedContainerId(containerId);
    try {
      const endpoint = isAdmin
        ? `/admin/containers/${containerId}/journey`
        : `/movement-logs/container/${containerId}`;
      const res = await api.get(endpoint);
      setJourneyLogs(res.data);
    } catch (err) {
      console.error(err);
      setJourneyLogs([]);
    } finally {
      setJourneyLoading(false);
    }
  };

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '32px' }}>Container Management</h1>

      {role === 'SHIPPING_LINE' && (
        <div className="glass-panel" style={{ marginBottom: '20px' }}>
          <h3 style={{ marginBottom: '14px' }}>Create Container</h3>
          {createSuccess && <p style={{ color: 'var(--success)', marginBottom: '12px' }}>{createSuccess}</p>}
          {createError && !createError.includes('Container number must be') && (
            <p style={{ color: 'var(--danger)', marginBottom: '12px' }}>{createError}</p>
          )}

          <form onSubmit={handleCreateContainer} style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Container Number</label>
              <input
                type="text"
                value={createForm.containerNumber}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, containerNumber: event.target.value.toUpperCase().trim() }))}
                placeholder="MSKU1234567"
              />
              <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Must match 4 uppercase letters + 7 digits.
              </small>
              {createError && createError.includes('Container number must be') && (
                <div style={{ color: 'var(--danger)', marginTop: '6px' }}>{createError}</div>
              )}
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Container Type</label>
              <select
                value={createForm.containerType}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, containerType: event.target.value }))}
              >
                <option value="STANDARD">STANDARD</option>
                <option value="REEFER">REEFER</option>
                <option value="OPEN_TOP">OPEN_TOP</option>
                <option value="FLAT_RACK">FLAT_RACK</option>
                <option value="TANK">TANK</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Size TEU</label>
              <select
                value={createForm.sizeTEU}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, sizeTEU: event.target.value }))}
              >
                <option value="20">20</option>
                <option value="40">40</option>
                <option value="45">45</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Seal Number</label>
              <input
                type="text"
                value={createForm.sealNumber}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, sealNumber: event.target.value }))}
                placeholder="Seal number"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Cargo Description</label>
              <input
                type="text"
                value={createForm.cargoDescription}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, cargoDescription: event.target.value }))}
                placeholder="Cargo description"
                required
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Weight KG</label>
              <input
                type="number"
                min="1000"
                value={createForm.weightKG}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, weightKG: event.target.value }))}
                placeholder="At least 1000 KG"
                required
              />
              <small style={{ color: 'var(--text-muted)', display: 'block', marginTop: '6px' }}>
                Backend requires a minimum weight of 1000 kg.
              </small>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <button className="btn" type="submit" disabled={createLoading}>
                {createLoading ? 'Creating...' : 'Create Container'}
              </button>
            </div>
          </form>
        </div>
      )}
      
      <div className="glass-panel">
        <table>
          <thead>
            <tr>
              <th>Container Number</th>
              <th>Status</th>
              <th>Type</th>
              <th>Weight (kg)</th>
              <th>Arrival Date</th>
              <th>Journey</th>
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
                <td>{c.arrivalDate ? new Date(c.arrivalDate).toLocaleDateString() : '-'}</td>
                <td>
                  <button className="btn btn-secondary" style={{ padding: '8px 12px' }} onClick={() => viewJourney(c.id)}>
                    View Lifecycle
                  </button>
                </td>
              </tr>
            ))}
            {containers.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>No containers found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedContainerId !== null && (
        <div className="glass-panel" style={{ marginTop: '20px' }}>
          <h3 style={{ marginBottom: '12px' }}>Lifecycle: Container ID {selectedContainerId}</h3>
          {journeyLoading && <p style={{ color: 'var(--text-muted)' }}>Loading movement logs...</p>}
          {!journeyLoading && journeyLogs.length === 0 && (
            <p style={{ color: 'var(--text-muted)' }}>No movement logs found for this container.</p>
          )}

          {!journeyLoading && journeyLogs.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Movement Type</th>
                  <th>Time</th>
                  <th>Location</th>
                  <th>Performed By</th>
                </tr>
              </thead>
              <tbody>
                {journeyLogs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.movementType}</td>
                    <td>{log.movementTime ? new Date(log.movementTime).toLocaleString() : '-'}</td>
                    <td>{log.location}</td>
                    <td>{log.performedBy?.username || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default Containers;
