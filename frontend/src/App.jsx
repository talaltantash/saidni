import { apiFetch } from './api.js';
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLang } from './i18n';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Browse from './pages/Browse';
import WorkerProfile from './pages/WorkerProfile';
import Login from './pages/Login';
import RegisterCustomer from './pages/RegisterCustomer';
import RegisterWorker from './pages/RegisterWorker';
import WorkerDashboard from './pages/WorkerDashboard';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { lang } = useLang();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang === 'ar' ? 'ar' : 'en';
  }, [lang]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await apiFetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const data = await res.json();
            setUser(data);
          } else {
            localStorage.removeItem('token');
          }
        } catch (err) {
          console.error('Auth check failed:', err);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div className="flex-center" style={{ height: '100vh' }}><div className="loading"></div></div>;
  }

  return (
    <BrowserRouter>
      <Navbar user={user} setUser={setUser} />
      <main style={{ minHeight: 'calc(100vh - 70px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/worker/:id" element={<WorkerProfile user={user} />} />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register/customer" element={<RegisterCustomer setUser={setUser} />} />
          <Route path="/register/worker" element={<RegisterWorker setUser={setUser} />} />
          <Route path="/dashboard" element={<ProtectedRoute user={user} requiredType="worker"><WorkerDashboard user={user} setUser={setUser} /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute user={user} requiredType="admin"><AdminPanel /></ProtectedRoute>} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
