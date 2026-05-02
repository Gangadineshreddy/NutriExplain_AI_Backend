import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ScanLine, History, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, logout } = useAuth();

  // Don't show nav on these screens
  const hiddenRoutes = ['/scan', '/analyzing', '/result', '/', '/login', '/signup', '/health-profile', '/medical-conditions', '/lifestyle', '/forgot-password'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const tabs = [
    { name: 'Dashboard', path: '/home', icon: Home },
    { name: 'Scan Food', path: '/scan', icon: ScanLine },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <h2 className="text-xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: 'var(--primary-green)' }}>Nutri</span>AI
        </h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, padding: '0 16px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname.startsWith(tab.path);
          
          return (
            <div 
              key={tab.name}
              onClick={() => navigate(tab.path)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '12px',
                cursor: 'pointer',
                color: isActive ? 'white' : 'var(--text-muted)',
                background: isActive ? 'linear-gradient(135deg, var(--primary-green), var(--primary-dark))' : 'transparent',
                transition: 'all 0.2s ease',
                fontWeight: isActive ? '600' : '400'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              <Icon size={20} color={isActive ? 'white' : 'var(--text-muted)'} />
              <span>{tab.name}</span>
            </div>
          );
        })}
      </div>

      <div style={{ padding: '0 16px', marginTop: 'auto' }}>
        <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p className="font-semibold text-sm" style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{userName || 'User'}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '8px', 
              color: 'var(--danger)', background: 'transparent', border: 'none', 
              cursor: 'pointer', fontSize: '14px', marginTop: '4px' 
            }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
