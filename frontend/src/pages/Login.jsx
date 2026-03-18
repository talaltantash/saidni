import { apiFetch } from '../api.js';
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLang } from '../i18n';
import './Auth.css';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const { t } = useLang();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError(t('messages.requiredField'));
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        setUser(data.user);
        navigate('/');
      } else if (res.status === 401) {
        setError(t('messages.invalidCredentials'));
      } else {
        setError(t('messages.error'));
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(t('messages.error'));
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>{t('auth.login')}</h1>
        <p className="auth-subtitle">{t('tagline')}</p>

        {error && <div className="error-text" style={{ marginBottom: '1rem' }}>{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>{t('auth.email')}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>

          <div className="form-group">
            <label>{t('auth.password')}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? t('messages.loading') : t('auth.login')}
          </button>
        </form>

        <div className="auth-links">
          <p>
            {t('auth.noAccount')}<br />
            <Link to="/register/customer" className="link-primary">
              {t('auth.registerAsCustomer')}
            </Link>
            {' / '}
            <Link to="/register/worker" className="link-primary">
              {t('auth.registerAsWorker')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
