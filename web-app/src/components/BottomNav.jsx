import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ScanLine, History, User } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show nav on these screens
  const hiddenRoutes = ['/scan', '/analyzing', '/result', '/', '/login', '/signup', '/health-profile', '/medical-conditions', '/lifestyle'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const tabs = [
    { name: 'Home', path: '/home', icon: Home },
    { name: 'Scan', path: '/scan', icon: ScanLine },
    { name: 'History', path: '/history', icon: History },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = location.pathname.startsWith(tab.path);
        
        return (
          <div 
            key={tab.name}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <Icon size={24} color={isActive ? 'var(--primary-green)' : 'var(--text-muted)'} />
            <span>{tab.name}</span>
          </div>
        );
      })}
    </div>
  );
};

export default BottomNav;
