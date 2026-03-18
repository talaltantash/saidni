import { apiFetch } from '../api.js';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../i18n';
import './Auth.css';

export default function RegisterCustomer({ setUser }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
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
      const res = await apiFetch('/api/auth/register-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setUser(data.user);
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
      <div className="auth-card">
        <h1>{t('auth.registerAsCustomer')}</h1>
        <p className="auth-subtitle">{t('tagline')}</p>

        {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
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
