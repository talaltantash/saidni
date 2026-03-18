import { apiFetch } from '../api.js';
import React, { useState, useEffect } from 'react';
import { useLang } from '../i18n';
import './Dashboard.css';

export default function AdminPanel() {
  const { t } = useLang();
  const [tab, setTab] = useState('pending');
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioning, setActioning] = useState(null);

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/admin/workers/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkers(data);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
    }
    setLoading(false);
  };

  const handleVerify = async (workerId, status) => {
    setActioning(workerId);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch(`/api/admin/workers/${workerId}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setWorkers(prev => prev.filter(w => w.id !== workerId));
      }
    } catch (err) {
      console.error('Error verifying worker:', err);
    }
    setActioning(null);
  };

  const pendingWorkers = workers.filter(w => w.verification_status === 'pending');
  const verifiedWorkers = workers.filter(w => w.verification_status === 'verified');
  const rejectedWorkers = workers.filter(w => w.verification_status === 'rejected');

  let displayedWorkers = [];
  if (tab === 'pending') displayedWorkers = pendingWorkers;
  else if (tab === 'verified') displayedWorkers = verifiedWorkers;
  else displayedWorkers = rejectedWorkers;

  return (
    <div className="page-admin">
      <div className="container">
        <h1>{t('admin.adminPanel')}</h1>

        <div className="admin-tabs">
          <button
            className={`tab-btn ${tab === 'pending' ? 'active' : ''}`}
            onClick={() => setTab('pending')}
          >
            {t('admin.pending')} ({pendingWorkers.length})
          </button>
          <button
            className={`tab-btn ${tab === 'verified' ? 'active' : ''}`}
            onClick={() => setTab('verified')}
          >
            {t('admin.verified')} ({verifiedWorkers.length})
          </button>
          <button
            className={`tab-btn ${tab === 'rejected' ? 'active' : ''}`}
            onClick={() => setTab('rejected')}
          >
            {t('admin.rejected')} ({rejectedWorkers.length})
          </button>
        </div>

        {loading ? (
          <div className="flex-center" style={{ padding: '2rem' }}>
            <div className="loading"></div>
          </div>
        ) : displayedWorkers.length > 0 ? (
          <div className="card">
            <div className="workers-table">
              <table>
                <thead>
                  <tr>
                    <th>{t('admin.name')}</th>
                    <th>{t('admin.category')}</th>
                    <th>{t('admin.location')}</th>
                    <th>{t('admin.vtcNumber')}</th>
                    <th>{t('admin.registrationDate')}</th>
                    {tab === 'pending' && <th>{t('messages.error')}</th>}
                  </tr>
                </thead>
                <tbody>
                  {displayedWorkers.map(worker => (
                    <tr key={worker.id}>
                      <td>
                        <strong>{worker.name}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                          {worker.email}
                        </div>
                      </td>
                      <td>{t(`categories.${worker.category}`)}</td>
                      <td>{t(`locations.${worker.location}`)}</td>
                      <td style={{ fontSize: '11px' }}>{worker.vtc_license_number}</td>
                      <td style={{ fontSize: '11px' }}>
                        {new Date(worker.created_at).toLocaleDateString('ar-JO')}
                      </td>
                      {tab === 'pending' && (
                        <td>
                          <div className="actions-cell">
                            <button
                              onClick={() => handleVerify(worker.id, 'verified')}
                              disabled={actioning === worker.id}
                              className="btn btn-success btn-small"
                            >
                              ✓ {t('admin.approve')}
                            </button>
                            <button
                              onClick={() => handleVerify(worker.id, 'rejected')}
                              disabled={actioning === worker.id}
                              className="btn btn-error btn-small"
                            >
                              ✗ {t('admin.reject')}
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <h3>{t('admin.noWorkers')}</h3>
            <p>{t('messages.notFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
