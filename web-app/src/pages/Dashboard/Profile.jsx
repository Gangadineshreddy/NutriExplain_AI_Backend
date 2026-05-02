import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, Activity, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="screen-padding flex-column animate-fade-in" style={{ paddingBottom: '80px' }}>
      <h1 className="text-xl font-bold mb-6">Profile</h1>

      <div className="flex-center flex-column mb-8">
        <div style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          background: userProfile?.profile_image_url ? `url(${userProfile.profile_image_url}) center/cover` : 'var(--bg-card)',
          border: '2px solid var(--primary-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '16px'
        }}>
          {!userProfile?.profile_image_url && <User size={48} color="var(--text-muted)" />}
        </div>
        <h2 className="text-lg font-bold">{userProfile?.full_name || 'User'}</h2>
        <p className="text-muted">{userProfile?.email || 'email@example.com'}</p>
      </div>

      <div className="flex-column gap-4">
        <div className="glass-panel flex-between" style={{ padding: '16px', cursor: 'pointer' }} onClick={() => navigate('/edit-profile')}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <Settings size={20} color="var(--primary-green)" />
            <span className="font-semibold">Edit Profile</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 className="font-bold mb-4" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <Activity size={20} color="var(--accent)" /> Health Stats
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <p className="text-muted text-sm">Height</p>
              <p className="font-semibold">{userProfile?.height_cm || '--'} cm</p>
            </div>
            <div>
              <p className="text-muted text-sm">Weight</p>
              <p className="font-semibold">{userProfile?.weight_kg || '--'} kg</p>
            </div>
            <div>
              <p className="text-muted text-sm">Age</p>
              <p className="font-semibold">{userProfile?.age || '--'} yrs</p>
            </div>
            <div>
              <p className="text-muted text-sm">Activity</p>
              <p className="font-semibold">{userProfile?.activity_level || '--'}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px' }}>
          <h3 className="font-bold mb-4" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <AlertCircle size={20} color="var(--danger)" /> Conditions
          </h3>
          {userProfile?.conditions && userProfile.conditions.length > 0 ? (
            <div className="flex-column gap-2">
              {userProfile.conditions.map((c, i) => (
                <div key={i} className="flex-between">
                  <span>{c.disease_name}</span>
                  <span className="text-muted text-sm">{c.stage}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted text-sm">No conditions reported.</p>
          )}
        </div>

        <button className="btn-secondary mt-4" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }} onClick={handleLogout}>
          <LogOut size={20} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
