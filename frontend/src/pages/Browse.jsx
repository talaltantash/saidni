import { apiFetch } from '../api.js';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLang } from '../i18n';
import WorkerCard from '../components/WorkerCard';
import './Browse.css';

export default function Browse() {
  const { t } = useLang();
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    location: '',
    minRating: '',
    search: ''
  });

  const categories = [
    'سباكة', 'كهرباء', 'تكييف', 'نجارة', 'دهانات', 'تنظيف', 'صيانة مسابح', 'صيانة عامة'
  ];

  const locations = [
    'عمّان - الشميساني', 'عمّان - دابوق', 'عمّان - الدوار السابع', 'عمّان - العبدلي',
    'عمّان - الرابية', 'عمّان - خلدا', 'عمّان - الجاردنز', 'عمّان - مرج الحمام',
    'عمّان - صويلح', 'عمّان - الجبيهة', 'عمّان - تلاع العلي', 'عمّان - أبو نصير',
    'عمّان - ماركا', 'الزرقاء', 'إربد', 'العقبة', 'السلط'
  ];

  useEffect(() => {
    fetchWorkers();
  }, [filters]);

  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.minRating) params.append('min_rating', filters.minRating);
      if (filters.search) params.append('search', filters.search);

      const res = await apiFetch(`/api/workers?${params}`);
      if (res.ok) {
        const data = await res.json();
        setWorkers(data);
      }
    } catch (err) {
      console.error('Error fetching workers:', err);
    }
    setLoading(false);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page-browse">
      <div className="filters-section">
        <div className="container">
          <div className="filters-grid">
            <div className="filter-group">
              <label>{t('browse.filterCategory')}</label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">{t('worker_form.selectCategory')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t('browse.filterLocation')}</label>
              <select
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              >
                <option value="">{t('worker_form.selectLocation')}</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{t(`locations.${loc}`)}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>{t('browse.filterRating')}</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
              >
                <option value="">الكل</option>
                <option value="3">3+ ⭐</option>
                <option value="4">4+ ⭐</option>
                <option value="4.5">4.5+ ⭐</option>
              </select>
            </div>

            <div className="filter-group">
              <label>{t('browse.search')}</label>
              <input
                type="text"
                placeholder={t('browse.search')}
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container browse-content">
        <h1>{t('browse.title')}</h1>

        {loading ? (
          <div className="flex-center" style={{ padding: '2rem' }}>
            <div className="loading"></div>
          </div>
        ) : workers.length > 0 ? (
          <div className="workers-grid">
            {workers.map(worker => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>{t('browse.noWorkers')}</h3>
            <p>{t('messages.notFound')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
