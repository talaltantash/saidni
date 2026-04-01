import { apiFetch } from '../api.js';
import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useLang } from '../i18n';
import StarRating from '../components/StarRating';
import './WorkerProfile.css';

export default function WorkerProfile({ user }) {
  const { id } = useParams();
  const { t } = useLang();
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviewData, setReviewData] = useState({ rating: 0, comment: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [bookingData, setBookingData] = useState({ service_description: '', payment_method: 'cash' });
  const [bookingSubmitting, setBookingSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');


  useEffect(() => {
    fetchWorker();
  }, [id]);

  const fetchWorker = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`/api/workers/${id}`);
      if (res.ok) {
        const data = await res.json();
        setWorker(data);
      } else {
        setError(t('messages.notFound'));
      }
    } catch (err) {
      console.error('Error fetching worker:', err);
      setError(t('messages.error'));
    }
    setLoading(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!user || user.user_type !== 'customer') {
      setError(t('worker.loginToReview'));
      return;
    }

    if (!reviewData.rating || !reviewData.comment.trim()) {
      setError(t('messages.requiredField'));
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          worker_id: parseInt(id),
          rating: reviewData.rating,
          comment: reviewData.comment
        })
      });

      if (res.ok) {
        setSuccess(t('messages.success'));
        setReviewData({ rating: 0, comment: '' });
        setTimeout(() => fetchWorker(), 1000);
      } else if (res.status === 403) {
        setError(t('worker.loginToReview'));
      } else {
        setError(t('messages.error'));
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setError(t('messages.error'));
    }
    setSubmitting(false);
  };


  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setBookingError('');
    setBookingSuccess('');
    if (!bookingData.service_description.trim()) {
      setBookingError('يرجى وصف الخدمة المطلوبة');
      return;
    }
    setBookingSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await apiFetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({
          worker_id: parseInt(id),
          service_description: bookingData.service_description,
          payment_method: bookingData.payment_method
        })
      });
      if (res.ok) {
        setBookingSuccess('تم إرسال طلب الحجز بنجاح!');
        setBookingData({ service_description: '', payment_method: 'cash' });
      } else {
        setBookingError('حدث خطأ، حاول مرة أخرى');
      }
    } catch (err) {
      setBookingError('حدث خطأ، حاول مرة أخرى');
    }
    setBookingSubmitting(false);
  };

  if (loading) {
    return <div className="flex-center" style={{ height: '100vh' }}><div className="loading"></div></div>;
  }

  if (!worker) {
    return <Navigate to="/browse" />;
  }

  const whatsappUrl = `https://wa.me/${worker.whatsapp_number.replace(/\D/g, '')}`;

  return (
    <div className="page-worker-profile">
      <div className="worker-header-section">
        <div className="container">
          <div className="worker-header-content">
            <div className="worker-avatar-large" style={{ backgroundColor: 'var(--green-primary)' }}>
              {worker.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
            </div>
            <div className="worker-header-info">
              <div className="header-name-row">
                <div>
                  <h1>{worker.name}</h1>
                  <span className="badge badge-green">{t(`categories.${worker.category}`)}</span>
                  {worker.verification_status === 'verified' && (
                    <span className="badge badge-success" style={{ marginLeft: '0.5rem' }}>✓ {t('worker.verified')}</span>
                  )}
                </div>
              </div>
              <p style={{ marginTop: '0.5rem' }}>📍 {t(`locations.${worker.location}`)}</p>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ marginTop: '1rem', display: 'inline-block' }}>
                💬 {t('worker.whatsapp')}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="container worker-profile-content">
        <div className="profile-grid">
          <div className="profile-main">
            <div className="card">
              <h3>{t('worker.profile')}</h3>
              <div className="divider"></div>
              <p>{worker.bio}</p>

              <div className="stats-section">
                <div className="stat-item">
                  <h4>{worker.experience_years}</h4>
                  <p>{t('worker.years')}</p>
                </div>
                <div className="stat-item">
                  <h4>{worker.avg_rating.toFixed(1)}</h4>
                  <p>{t('worker.rating')}</p>
                </div>
                <div className="stat-item">
                  <h4>{worker.review_count}</h4>
                  <p>{t('worker.reviews')}</p>
                </div>
                <div className="stat-item">
                  <h4>{worker.is_available ? '✓' : '✗'}</h4>
                  <p>{worker.is_available ? t('worker.available') : t('worker.unavailable')}</p>
                </div>
              </div>
            </div>


            {user && user.user_type === 'customer' && (
              <div className="card mt-3">
                <h3>احجز هذا الحرفي</h3>
                <div className="divider"></div>
                {bookingError && <div className="error-text">{bookingError}</div>}
                {bookingSuccess && <div className="success-text">{bookingSuccess}</div>}
                <form onSubmit={handleSubmitBooking}>
                  <div className="form-group">
                    <label>وصف الخدمة المطلوبة</label>
                    <textarea
                      value={bookingData.service_description}
                      onChange={(e) => setBookingData(prev => ({ ...prev, service_description: e.target.value }))}
                      placeholder="اكتب وصفا للخدمة التي تحتاجها..."
                      rows={3}
                    />
                  </div>
                  <div className="form-group mt-2">
                    <label>طريقة الدفع</label>
                    <select
                      value={bookingData.payment_method}
                      onChange={(e) => setBookingData(prev => ({ ...prev, payment_method: e.target.value }))}
                      style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '1rem' }}
                    >
                      <option value="cash">كاش</option>
                      <option value="cliq">CliQ</option>
                      <option value="visa_mastercard">فيزا / ماستركارد</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-primary btn-full" disabled={bookingSubmitting} style={{ marginTop: '1rem' }}>
                    {bookingSubmitting ? 'جاري الارسال...' : 'ارسال طلب الحجز'}
                  </button>
                </form>
              </div>
            )}

            <div className="card mt-3">
              <h3>{t('worker.reviews')}</h3>
              <div className="divider"></div>

              {worker.reviews && worker.reviews.length > 0 ? (
                <div className="reviews-list">
                  {worker.reviews.map(review => (
                    <div key={review.id} className="review-item">
                      <div className="review-header">
                        <strong>{review.customer_name}</strong>
                        <div className="review-rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} style={{ opacity: i < review.rating ? 1 : 0.25 }}>★</span>
                          ))}
                        </div>
                      </div>
                      <p>{review.comment}</p>
                      <small style={{ color: 'var(--text-secondary)' }}>
                        {new Date(review.created_at).toLocaleDateString('ar-JO')}
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="opacity-50">{t('worker.noReviews')}</p>
              )}
            </div>

            {user && user.user_type === 'customer' && (
              <div className="card mt-3">
                <h3>{t('worker.leaveReview')}</h3>
                <div className="divider"></div>

                {error && <div className="error-text">{error}</div>}
                {success && <div className="success-text">✓ {success}</div>}

                <form onSubmit={handleSubmitReview}>
                  <div className="form-group">
                    <label>{t('worker.yourRating')}</label>
                    <StarRating
                      rating={reviewData.rating}
                      onChange={(rating) => setReviewData(prev => ({ ...prev, rating }))}
                      interactive={true}
                    />
                  </div>

                  <div className="form-group mt-2">
                    <label>{t('worker.yourComment')}</label>
                    <textarea
                      value={reviewData.comment}
                      onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                      placeholder={t('worker.yourComment')}
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-full"
                    disabled={submitting}
                  >
                    {submitting ? t('messages.loading') : t('worker.submitReview')}
                  </button>
                </form>
              </div>
            )}

            {!user && (
              <div className="card mt-3" style={{ textAlign: 'center', padding: '2rem' }}>
                <p>{t('worker.loginToReview')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
