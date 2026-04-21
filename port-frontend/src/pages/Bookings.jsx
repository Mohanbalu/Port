import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    userId: '',
    containerId: '',
    destination: '',
  });

  const fetchBookings = async () => {
    setError('');
    try {
      const res = await api.get('/bookings');
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch bookings');
      setBookings([]);
    }
  };

  useEffect(() => {
    api.get('/bookings')
      .then((res) => {
        setBookings(res.data);
      })
      .catch((err) => {
        setError(err.response?.data?.error || 'Failed to fetch bookings');
        setBookings([]);
      });
  }, []);

  const handleCreateBooking = async (event) => {
    event.preventDefault();
    setCreating(true);
    setError('');

    const payload = {
      bookedBy: { id: Number(form.userId) },
      container: { id: Number(form.containerId) },
      destination: form.destination,
    };

    try {
      await api.post('/bookings', payload);
      setForm({ userId: '', containerId: '', destination: '' });
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create booking');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: '0 32px' }} className="animate-fade-in">
      <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Bookings</h1>

      {error && (
        <div className="glass-panel" style={{ marginBottom: '16px', borderColor: 'rgba(255, 75, 75, 0.4)' }}>
          <strong style={{ color: 'var(--danger)' }}>{error}</strong>
        </div>
      )}

      <div className="glass-panel" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '12px' }}>Create Booking</h3>
        <form onSubmit={handleCreateBooking} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Booked By User ID</label>
            <input value={form.userId} onChange={(e) => setForm((prev) => ({ ...prev, userId: e.target.value }))} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Container ID</label>
            <input value={form.containerId} onChange={(e) => setForm((prev) => ({ ...prev, containerId: e.target.value }))} required />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '6px', color: 'var(--text-muted)' }}>Destination</label>
            <input value={form.destination} onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))} required />
          </div>
          <button className="btn" type="submit" disabled={creating} style={{ gridColumn: '1 / 2' }}>
            {creating ? 'Creating...' : 'Create'}
          </button>
        </form>
      </div>

      <div className="glass-panel">
        <h3 style={{ marginBottom: '12px' }}>Booking List</h3>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Booked By</th>
              <th>Container ID</th>
              <th>Destination</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.id}</td>
                <td>{booking.userId || booking.bookedBy?.username || booking.bookedBy?.id || '-'}</td>
                <td>{booking.containerId || booking.container?.id || '-'}</td>
                <td>{booking.destination || '-'}</td>
                <td>{booking.bookingDate ? new Date(booking.bookingDate).toLocaleString() : '-'}</td>
              </tr>
            ))}
            {bookings.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
