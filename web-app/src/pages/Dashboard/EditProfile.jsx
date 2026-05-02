import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, Camera } from 'lucide-react';

const EditProfile = () => {
  const { userId, userProfile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    height_cm: '',
    weight_kg: '',
    activity_level: '',
    sleep_hours: '',
    stress_level: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        age: userProfile.age || '',
        height_cm: userProfile.height_cm || '',
        weight_kg: userProfile.weight_kg || '',
        activity_level: userProfile.activity_level || 'Moderately Active',
        sleep_hours: userProfile.sleep_hours || 7,
        stress_level: userProfile.stress_level || 'Medium'
      });
    }
  }, [userProfile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imgFormData = new FormData();
    imgFormData.append('image', file);
    imgFormData.append('user_id', userId);

    try {
      toast.loading('Uploading image...', { id: 'upload' });
      await api.uploadProfileImage(imgFormData);
      await refreshProfile();
      toast.success('Image uploaded!', { id: 'upload' });
    } catch (err) {
      toast.error('Failed to upload image', { id: 'upload' });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await api.updateProfile({
        user_id: userId,
        ...formData
      });
      await refreshProfile();
      toast.success('Profile updated successfully');
      navigate('/profile');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-padding flex-column animate-fade-in">
      <div className="flex-between mb-6">
        <button className="back-button" onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Edit Profile</h1>
        <div style={{ width: '40px' }} />
      </div>

      <div className="flex-center flex-column mb-8">
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: userProfile?.profile_image_url ? `url(${userProfile.profile_image_url}) center/cover` : 'var(--bg-card)',
            border: '2px solid var(--primary-green)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {!userProfile?.profile_image_url && <Camera size={32} color="var(--text-muted)" />}
          </div>
          <label style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            background: 'var(--primary-green)',
            padding: '8px',
            borderRadius: '50%',
            cursor: 'pointer'
          }}>
            <Camera size={16} color="white" />
            <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />
          </label>
        </div>
      </div>

      <div className="glass-panel w-full flex-column gap-4 mb-8">
        <label className="text-sm text-muted">Full Name</label>
        <input type="text" name="full_name" className="glass-input" value={formData.full_name} onChange={handleChange} />
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <label className="text-sm text-muted">Age</label>
            <input type="number" name="age" className="glass-input" value={formData.age} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-muted">Height (cm)</label>
            <input type="number" name="height_cm" className="glass-input" value={formData.height_cm} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-muted">Weight (kg)</label>
            <input type="number" name="weight_kg" className="glass-input" value={formData.weight_kg} onChange={handleChange} />
          </div>
          <div>
            <label className="text-sm text-muted">Sleep (hrs)</label>
            <input type="number" name="sleep_hours" className="glass-input" value={formData.sleep_hours} onChange={handleChange} />
          </div>
        </div>

        <label className="text-sm text-muted">Activity Level</label>
        <select name="activity_level" className="glass-input" value={formData.activity_level} onChange={handleChange}>
          <option value="Sedentary">Sedentary</option>
          <option value="Lightly Active">Lightly Active</option>
          <option value="Moderately Active">Moderately Active</option>
          <option value="Very Active">Very Active</option>
        </select>
      </div>

      <button className="btn-primary mt-auto" onClick={handleSave} disabled={isLoading}>
        {isLoading ? <div className="loader" /> : <><Save size={20} /> Save Changes</>}
      </button>
    </div>
  );
};

export default EditProfile;
