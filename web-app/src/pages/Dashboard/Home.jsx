import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Scan, Activity, Utensils, History } from 'lucide-react';

const Home = () => {
  const { userName, userProfile } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="screen-padding flex-column animate-fade-in" style={{ paddingBottom: '80px', height: '100%' }}>
      <div className="mb-6">
        <h1 className="text-xl font-bold">Hello, <span className="text-primary">{userName || 'User'}</span> 👋</h1>
        <p className="text-muted">Let's check your nutrition today.</p>
      </div>

      <div className="dashboard-grid" style={{ flex: 1 }}>
        {/* Left Column on Desktop */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '16px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'} onClick={() => navigate('/scan')}>
                <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '16px', borderRadius: '16px' }}>
                  <Scan size={28} color="var(--primary-green)" />
                </div>
                <span className="font-semibold text-sm mt-2">Scan Food</span>
              </div>
              
              <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '16px', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'} onClick={() => navigate('/history')}>
                <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '16px', borderRadius: '16px' }}>
                  <History size={28} color="var(--accent)" />
                </div>
                <span className="font-semibold text-sm mt-2">History</span>
              </div>
            </div>
          </div>

          <div className="glass-panel w-full flex-between" style={{ padding: '24px' }}>
            <div>
              <h2 className="text-lg font-bold mb-1">Health Score</h2>
              <p className="text-muted text-sm">Based on recent scans</p>
            </div>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', border: '6px solid var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)' }}>
              <span className="font-bold text-2xl">92</span>
            </div>
          </div>
        </div>

        {/* Right Column on Desktop */}
        <div>
          <h2 className="text-lg font-bold mb-4">Your Guidelines</h2>
          <div className="flex-column gap-3">
            <div className="glass-panel flex-between" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(245, 158, 11, 0.2)', borderRadius: '10px' }}>
                  <Utensils size={24} color="var(--warning)" />
                </div>
                <div>
                  <span className="font-bold" style={{ display: 'block' }}>Daily Calories</span>
                  <span className="text-muted text-sm">Target Limit</span>
                </div>
              </div>
              <span className="font-bold text-lg">~2000 kcal</span>
            </div>
            <div className="glass-panel flex-between" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.2)', borderRadius: '10px' }}>
                  <Activity size={24} color="var(--danger)" />
                </div>
                <div>
                  <span className="font-bold" style={{ display: 'block' }}>Activity Goal</span>
                  <span className="text-muted text-sm">Current Level</span>
                </div>
              </div>
              <span className="font-bold text-lg" style={{ textTransform: 'capitalize' }}>{userProfile?.activity_level || 'Moderate'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
