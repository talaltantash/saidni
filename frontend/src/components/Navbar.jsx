import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLang } from '../i18n';
import './Navbar.css';

export default function Navbar({ user, setUser }) {
  const { lang, setLang, t } = useLang();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    setLang();
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-logo">
            <span className="logo-text">{t('appName')}</span>
            <span className="logo-icon">⭐</span>
          </Link>

          <div className={`navbar-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <Link to="/" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.home')}
            </Link>
            <Link to="/browse" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
              {t('nav.browse')}
            </Link>

            {user && user.user_type === 'customer' && (
              <Link to="/browse" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.myBookings')}
              </Link>
            )}

            {user && user.user_type === 'worker' && (
              <Link to="/dashboard" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.dashboard')}
              </Link>
            )}

            {user && user.user_type === 'admin' && (
              <Link to="/admin" className="navbar-link" onClick={() => setMobileMenuOpen(false)}>
                {t('nav.admin')}
              </Link>
            )}
          </div>

          <div className="navbar-actions">
            <button onClick={handleLanguageToggle} className="btn-language">
              {lang === 'ar' ? 'EN' : 'ع'}
            </button>

            {!user ? (
              <>
                <Link to="/login" className="btn btn-primary btn-small">
                  {t('nav.login')}
                </Link>
              </>
            ) : (
              <button onClick={handleLogout} className="btn btn-outline btn-small">
                {t('nav.logout')}
              </button>
            )}

            <button
              className="navbar-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
