import React from 'react';
import { Link } from 'react-router-dom';
import { useLang } from '../i18n';
import GeometricPattern from '../components/GeometricPattern';
import './pages.css';

export default function Home() {
  const { t } = useLang();

  const categories = [
    { key: 'سباكة', icon: '🔧' },
    { key: 'كهرباء', icon: '⚡' },
    { key: 'تكييف', icon: '❄️' },
    { key: 'نجارة', icon: '🪵' },
    { key: 'دهانات', icon: '🖌️' },
    { key: 'تنظيف', icon: '🧹' },
    { key: 'صيانة مسابح', icon: '🏊' },
    { key: 'صيانة عامة', icon: '🔨' }
  ];

  return (
    <div className="page-home">
      <section className="hero">
        <GeometricPattern />
        <div className="container">
          <div className="hero-content">
            <h1>{t('heroTitle')}</h1>
            <p className="hero-subtitle">{t('heroSubtitle')}</p>
            <Link to="/browse" className="btn btn-secondary">
              {t('nav.browse')}
            </Link>
          </div>
        </div>
      </section>

      <section className="categories-section">
        <div className="container">
          <h2 className="text-center">{t('browse.title')}</h2>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link
                key={cat.key}
                to={`/browse?category=${encodeURIComponent(cat.key)}`}
                className="category-card"
              >
                <div className="category-icon">{cat.icon}</div>
                <p>{t(`categories.${cat.key}`)}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2 className="text-center">{t('home.howItWorks')}</h2>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h4>{t('home.step1Title')}</h4>
              <p>{t('home.step1Desc')}</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h4>{t('home.step2Title')}</h4>
              <p>{t('home.step2Desc')}</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h4>{t('home.step3Title')}</h4>
              <p>{t('home.step3Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="trust-section">
        <div className="container">
          <h2 className="text-center">{t('home.trustBadges')}</h2>
          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon">✓</div>
              <h4>{t('home.vtcVerified')}</h4>
              <p>كل مزودي الخدمات يتم التحقق منهم</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">⭐</div>
              <h4>{t('home.ratedByNeighbors')}</h4>
              <p>تقييمات حقيقية من العملاء المحليين</p>
            </div>
            <div className="trust-card">
              <div className="trust-icon">💬</div>
              <h4>{t('home.instantWhatsapp')}</h4>
              <p>تواصل فوري وآمن عبر WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container">
          <p>{t('appName')} - {t('tagline')}</p>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>© 2024 - جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}
