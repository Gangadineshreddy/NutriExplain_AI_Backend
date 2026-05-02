import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Scan, Activity, Utensils, History } from 'lucide-react';

const Home = () => {
  const { userName, userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="screen-padding flex-column animate-fade-in" style={{ paddingBottom: '80px' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Hello, <span className="text-primary">{userName || 'User'}</span> 👋</h1>
        <p className="text-muted">Let's check your nutrition today.</p>
      </div>

      <div className="glass-panel w-full mb-6 flex-between">
        <div>
          <h2 className="text-lg font-bold mb-1">Health Score</h2>
          <p className="text-muted text-sm">Based on recent scans</p>
        </div>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '4px solid var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span className="font-bold text-lg">92</span>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '16px' }} onClick={() => navigate('/scan')}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '12px', borderRadius: '12px' }}>
            <Scan size={24} color="var(--primary-green)" />
          </div>
          <span className="font-semibold text-sm">Scan Food</span>
        </div>
        
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '16px' }} onClick={() => navigate('/history')}>
          <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '12px', borderRadius: '12px' }}>
            <History size={24} color="var(--accent)" />
          </div>
          <span className="font-semibold text-sm">History</span>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4">Your Guidelines</h2>
      <div className="flex-column gap-3">
        <div className="glass-input flex-between" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Utensils size={20} color="var(--warning)" />
            <span className="font-semibold">Daily Calories</span>
          </div>
          <span className="text-muted">~2000 kcal</span>
        </div>
        <div className="glass-input flex-between" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Activity size={20} color="var(--danger)" />
            <span className="font-semibold">Activity Goal</span>
          </div>
          <span className="text-muted">{userProfile?.activity_level || 'Moderate'}</span>
        </div>
      </div>
    </div>
  );
};

export default Home;
