import { apiFetch } from '../api.js';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLang } from '../i18n';
import './Dashboard.css';

export default function CustomerDashboard({ user }) {
  const { t } = useLang();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'accepted': return 'badge-success';
      case 'declined': return 'badge-error';
      case 'completed': return 'badge-green';
      default: return 'badge-gold';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'pending': return 'قيد الانتظار';
      case 'accepted': return 'مقبول';
      case 'declined': return 'مرفوض';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '100vh' }}><div className="loading"></div></div>;
  }

  return (
    <div className="page-dashboard">
      <div className="container">
        <h1>حجوزاتي</h1>

        <div className="card mt-3">
          {bookings.length > 0 ? (
            <div className="bookings-list">
              {bookings.map(booking => (
                <div key={booking.id} className="booking-item">
                  <div className="booking-header">
                    <h4>{booking.worker_name}</h4>
                    <span className={`badge ${getStatusColor(booking.status)}`}>
                      {getStatusLabel(booking.status)}
                    </span>
                  </div>
                  <p className="booking-category">{booking.category} • {booking.location}</p>
                  <p className="booking-description">{booking.service_description}</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    💳 {booking.payment_method === 'cash' ? 'كاش' : booking.payment_method === 'cliq' ? 'CliQ' : 'فيزا/ماستركارد'}
                  </p>
                  <small style={{ color: 'var(--text-secondary)' }}>
                    {new Date(booking.created_at).toLocaleDateString('ar-JO')}
                  </small>

                  {booking.status === 'completed' && (
                    <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'var(--green-light)', borderRadius: '8px' }}>
                      <p style={{ color: 'var(--green-primary)', fontWeight: '600', marginBottom: '0.5rem' }}>
                        ⭐ كيف كانت تجربتك؟ اترك تقييماً للحرفي
                      </p>
                      <button
                        onClick={() => navigate(`/worker/${booking.worker_id}`)}
                        className="btn btn-primary btn-small"
                      >
                        اترك تقييم
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="opacity-50" style={{ padding: '2rem', textAlign: 'center' }}>لا توجد حجوزات بعد</p>
          )}
        </div>
      </div>
    </div>
  );
}
