import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const HealthProfile = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'Male',
    height_cm: '',
    weight_kg: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = async () => {
    if (!formData.age || !formData.height_cm || !formData.weight_kg) {
      toast.error("Please fill all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      localStorage.setItem('healthData', JSON.stringify(formData));
      await api.addHealthProfile({
        user_id: userId,
        activity_level: 'Lightly Active',
        sleep_hours: 7.5,
        stress_level: 'Medium',
        ...formData
      });
      navigate('/medical-conditions');
    } catch (err) {
      toast.error("Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-padding flex-column animate-fade-in">
      <div className="glass-panel w-full" style={{ marginTop: '20px' }}>
        <h1 className="text-2xl font-bold text-primary mb-2">Step 1 of 3</h1>
        <p className="text-muted mb-8">Basic Health Profile</p>

        <div className="flex-column gap-4">
          <input type="number" name="age" className="glass-input" placeholder="Age" value={formData.age} onChange={handleChange} />
          
          <select name="gender" className="glass-input" value={formData.gender} onChange={handleChange}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          
          <input type="number" name="height_cm" className="glass-input" placeholder="Height (cm)" value={formData.height_cm} onChange={handleChange} />
          <input type="number" name="weight_kg" className="glass-input" placeholder="Weight (kg)" value={formData.weight_kg} onChange={handleChange} />
        </div>

        <button className="btn-primary mt-8" onClick={handleNext} disabled={isLoading}>
          {isLoading ? <div className="loader" /> : 'Continue'}
        </button>
      </div>
    </div>
  );
};

export default HealthProfile;
