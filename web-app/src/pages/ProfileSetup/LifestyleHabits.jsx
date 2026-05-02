import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const LifestyleHabits = () => {
  const { userId, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    activity_level: 'Lightly Active',
    sleep_hours: 7,
    stress_level: 'Medium'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFinish = async () => {
    setIsLoading(true);
    try {
      // 1. Update Profile with lifestyle data
      const healthData = JSON.parse(localStorage.getItem('healthData') || '{}');
      await api.updateProfile({
        user_id: userId,
        age: healthData.age || 0,
        gender: healthData.gender || 'Male',
        height_cm: healthData.height_cm || 0,
        weight_kg: healthData.weight_kg || 0,
        ...formData
      });

      // 2. Set default nutrition limits based on generic calculations (Simplified)
      // In a real app, this might be calculated by backend or AI, but we mimic the mobile app
      await api.setNutritionLimit({
        user_id: userId,
        max_sugar: 35.0,
        max_sodium: 2300.0,
        max_fat: 70.0,
        max_carbs: 300.0
      });

      await refreshProfile();
      toast.success("Profile setup complete!");
      navigate('/home');
    } catch (err) {
      toast.error("Failed to complete setup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-padding flex-column animate-fade-in">
      <div className="glass-panel w-full" style={{ marginTop: '20px' }}>
        <h1 className="text-2xl font-bold text-primary mb-2">Step 3 of 3</h1>
        <p className="text-muted mb-8">Lifestyle Habits</p>

        <div className="flex-column gap-4">
          <label className="text-sm text-muted">Activity Level</label>
          <select name="activity_level" className="glass-input" value={formData.activity_level} onChange={handleChange}>
            <option value="Sedentary">Sedentary</option>
            <option value="Lightly Active">Lightly Active</option>
            <option value="Moderately Active">Moderately Active</option>
            <option value="Very Active">Very Active</option>
          </select>

          <label className="text-sm text-muted">Average Sleep (Hours)</label>
          <input 
            type="number" 
            name="sleep_hours" 
            className="glass-input" 
            value={formData.sleep_hours} 
            onChange={handleChange} 
            min="1" max="24"
          />

          <label className="text-sm text-muted">Stress Level</label>
          <select name="stress_level" className="glass-input" value={formData.stress_level} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <button className="btn-primary mt-8" onClick={handleFinish} disabled={isLoading}>
          {isLoading ? <div className="loader" /> : 'Complete Setup'}
        </button>
      </div>
    </div>
  );
};

export default LifestyleHabits;
