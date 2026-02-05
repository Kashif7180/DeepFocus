import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/DashboardPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Footer from './components/Footer';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Layout with Logout
const AppLayout = ({ children }) => {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    navigate('/login');
  };

  return (
    <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="nav-actions" style={{
        position: 'absolute',
        top: '2rem',
        right: '2rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        zIndex: 100
      }}>
        <button
          onClick={toggleTheme}
          className="glass-effect theme-toggle"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            fontSize: '1.25rem',
            cursor: 'pointer',
            border: '1px solid var(--card-border)',
            background: 'var(--glass)'
          }}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        <div className="glass-effect" style={{ padding: '0.5rem 1rem', borderRadius: '12px', background: 'var(--glass)' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            {userData.name}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="glass-effect"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '12px',
            fontSize: '0.875rem',
            cursor: 'pointer',
            color: 'var(--danger)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            background: 'var(--glass)'
          }}
        >
          LOGOUT
        </button>
      </div>
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
