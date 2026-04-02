import { apiFetch } from '../api.js';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../i18n';
import './Auth.css';

export default function RegisterWorker({ setUser }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: '',
    location: '',
    experience_years: '',
    bio: '',
    whatsapp_number: '',
    vtc_license_number: ''
  });
  const [error, setError] = useState('');
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const categories = [
    'سباكة', 'كهرباء', 'تكييف', 'نجارة', 'دهانات', 'تنظيف', 'صيانة مسابح', 'صيانة عامة'
  ];

  const locations = [
    'عمّان - الشميساني', 'عمّان - دابوق', 'عمّان - الدوار السابع', 'عمّان - العبدلي',
    'عمّان - الرابية', 'عمّان - خلدا', 'عمّان - الجاردنز', 'عمّان - مرج الحمام',
    'عمّان - صويلح', 'عمّان - الجبيهة', 'عمّان - تلاع العلي', 'عمّان - أبو نصير',
    'عمّان - ماركا', 'الزرقاء', 'إربد', 'العقبة', 'السلط'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const requiredFields = ['name', 'email', 'phone', 'password', 'confirmPassword', 'category', 'location', 'experience_years', 'bio', 'whatsapp_number', 'vtc_license_number'];
    if (requiredFields.some(field => !formData[field])) {
      setError(t('messages.requiredField'));
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t('messages.passwordMismatch'));
      return;
    }

    if (!formData.email.includes('@')) {
      setError(t('messages.invalidEmail'));
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/register-worker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
          category: formData.category,
          location: formData.location,
          experience_years: parseInt(formData.experience_years),
          bio: formData.bio,
          whatsapp_number: formData.whatsapp_number,
          vtc_license_number: formData.vtc_license_number
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setUser(data.user);
        if (photo) {
          const formData = new FormData();
          formData.append('photo', photo);
          await apiFetch('/api/workers/upload-photo', {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${data.token}` },
            body: formData
          });
        }
        navigate('/');
      } else if (res.status === 409) {
        setError(t('messages.emailExists'));
      } else {
        setError(t('messages.error'));
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(t('messages.error'));
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card auth-card-large">
        <h1>{t('auth.registerAsWorker')}</h1>
        <p className="auth-subtitle">{t('tagline')}</p>

        {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-section">
            <h3>{t('auth.register')}</h3>

            <div className="form-group">
              <label>{t('auth.name')}</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="الاسم الكامل"
              />
            </div>

            <div className="form-group">
              <label>{t('auth.email')}</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />
            </div>

            <div className="form-group">
              <label>{t('auth.phone')}</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+962791234567"
              />
            </div>

            <div className="form-group">
              <label>{t('auth.password')}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            <div className="form-group">
              <label>{t('auth.confirmPassword')}</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="divider"></div>

          <div className="form-section">
            <h3>{t('worker_form.category')}</h3>

            <div className="form-group">
              <label>{t('worker_form.category')}</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">{t('worker_form.selectCategory')}</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{t(`categories.${cat}`)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('worker_form.location')}</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
              >
                <option value="">{t('worker_form.selectLocation')}</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{t(`locations.${loc}`)}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>{t('worker_form.experience')}</label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="عدد السنوات"
                min="0"
              />
            </div>

            <div className="form-group">
              <label>{t('worker_form.bio')}</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="اكتب نبذة عن خبرتك وتخصصك"
              />
            </div>

            <div className="form-group">
              <label>{t('worker_form.whatsappNumber')}</label>
              <input
                type="tel"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
                placeholder="+962791234567"
              />
            </div>

            <div className="form-group">
              <label>{t('worker_form.vtcLicense')}</label>
              <input
                type="text"
                name="vtc_license_number"
                value={formData.vtc_license_number}
                onChange={handleChange}
                placeholder="رقم الترخيص"
              />
            </div>

            <div className="form-group">
              <label>صورة شخصية (اختياري)</label>
              {photoPreview && (
                <img src={photoPreview} alt="preview" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '0.5rem', display: 'block' }} />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                style={{ padding: '0.5rem 0' }}
              />
            </div>

            <div className="form-note">
              <p>{t('worker_form.reviewNote')}</p>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('messages.loading') : t('auth.register')}
          </button>
        </form>

        <div className="auth-links">
          <p>
            {t('auth.haveAccount')}{' '}
            <Link to="/login" className="link-primary">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
