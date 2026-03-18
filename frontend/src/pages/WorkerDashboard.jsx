import { apiFetch } from '../api.js';
import React, { useState, useEffect } from 'react';
import { useLang } from '../i18n';
import './Dashboard.css';

export default function WorkerDashboard({ user, setUser }) {
  const { t } = useLang();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

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

  const toggleAvailability = async () => {
    setUpdating(true);
    try {
      const token = localStorage.getItem('token');
      const newStatus = !user.worker.is_available;

      const res = await apiFetch(`/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setUser(prev => ({
          ...prev,
          worker: {
            ...prev.worker,
            is_available: newStatus
          }
        }));
      }
    } catch (err) {
      console.error('Error updating availability:', err);
    }
    setUpdating(false);
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'verified': return 'badge-success';
      case 'pending': return 'badge-gold';
      case 'rejected': return 'badge-error';
      default: return 'badge-green';
    }
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '100vh' }}><div className="loading"></div></div>;
  }

  return (
    <div className="page-dashboard">
      <div className="container">
        <h1>{t('dashboard.workerDashboard')}</h1>

        <div className="dashboard-grid">
          <div className="card profile-summary">
            <h3>{t('dashboard.profileSummary')}</h3>
            <div className="divider"></div>

            <div className="profile-item">
              <label>{t('auth.name')}</label>
              <p>{user.name}</p>
            </div>

            <div className="profile-item">
              <label>{t('worker_form.category')}</label>
              <p>{t(`categories.${user.worker.category}`)}</p>
            </div>

            <div className="profile-item">
              <label>{t('worker_form.location')}</label>
              <p>{t(`locations.${user.worker.location}`)}</p>
            </div>

            <div className="profile-item">
              <label>{t('dashboard.verificationStatus')}</label>
              <span className={`badge ${getStatusBadgeClass(user.worker.verification_status)}`}>
                {t(`dashboard.${user.worker.verification_status}`)}
              </span>
            </div>

            <div className="profile-item">
              <label>{t('worker.rating')}</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{user.worker.avg_rating.toFixed(1)}</span>
                <span>⭐</span>
              </div>
            </div>

            <div className="profile-item">
              <label>{t('dashboard.availability')}</label>
              <button
                onClick={toggleAvailability}
                disabled={updating}
                className={`btn btn-small ${user.worker.is_available ? 'btn-success' : 'btn-secondary'}`}
              >
                {user.worker.is_available ? t('dashboard.markAvailable') : t('dashboard.markUnavailable')}
              </button>
            </div>
          </div>

          <div className="card">
            <h3>{t('dashboard.recentBookings')}</h3>
            <div className="divider"></div>

            {bookings.length > 0 ? (
              <div className="bookings-list">
                {bookings.map(booking => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-header">
                      <h4>{booking.worker_name}</h4>
                      <span className={`badge badge-${booking.status === 'completed' ? 'success' : booking.status === 'pending' ? 'gold' : 'green'}`}>
                        {t(`bookings.${booking.status}`)}
                      </span>
                    </div>
                    <p className="booking-category">{t(`categories.${booking.category}`)} • {t(`locations.${booking.location}`)}</p>
                    <p className="booking-description">{booking.service_description}</p>
                    <small style={{ color: 'var(--text-secondary)' }}>
                      {new Date(booking.created_at).toLocaleDateString('ar-JO')}
                    </small>
                  </div>
                ))}
              </div>
            ) : (
              <p className="opacity-50">{t('bookings.noBookings')}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
