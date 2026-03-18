import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import StarRating from './StarRating';

export default function WorkerCard({ worker }) {
  const { t } = useLang();

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="card worker-card">
      <div className="worker-header">
        <div className="worker-avatar" style={{ backgroundColor: 'var(--green-primary)' }}>
          {getInitials(worker.name)}
        </div>
        <div className="worker-info-header">
          <h4>{worker.name}</h4>
          <span className="badge badge-green">{t(`categories.${worker.category}`)}</span>
          {worker.verification_status === 'verified' && (
            <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>✓ {t('worker.verified')}</span>
          )}
        </div>
      </div>

      <div className="worker-details">
        <p style={{ marginBottom: '0.5rem' }}><strong>{t('worker.years')}:</strong> {worker.experience_years}</p>
        <p style={{ marginBottom: '0.5rem' }}><strong>{t('nav.browse')}:</strong> {t(`locations.${worker.location}`)}</p>
      </div>

      <div className="worker-rating">
        <StarRating rating={worker.avg_rating} />
        <span className="rating-text">
          {worker.avg_rating.toFixed(1)} ({worker.review_count} {t('worker.reviews')})
        </span>
      </div>

      <Link to={`/worker/${worker.id}`} className="btn btn-primary btn-small btn-full">
        {t('worker.profile')}
      </Link>
    </div>
  );
}
