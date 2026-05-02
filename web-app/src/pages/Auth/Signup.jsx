import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Lock, Mail, UserPlus, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.register({ name, email, password });
      login(res.data.user_id, name);
      toast.success('Account created successfully!');
      navigate('/health-profile');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-padding flex-center animate-fade-in">
      <div className="glass-panel w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Create Account</h1>
          <p className="text-muted">Join NutriExplain AI today</p>
        </div>

        <form onSubmit={handleSignup} className="flex-column gap-4">
          <div style={{ position: 'relative' }}>
            <User size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
            <input 
              type="text" 
              className="glass-input" 
              placeholder="Full Name" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ paddingLeft: '48px' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
            <input 
              type="email" 
              className="glass-input" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ paddingLeft: '48px' }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
            <input 
              type="password" 
              className="glass-input" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ paddingLeft: '48px' }}
            />
          </div>

          <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
            {isLoading ? <div className="loader" /> : <><UserPlus size={20} /> Sign Up</>}
          </button>
        </form>

        <p className="text-center mt-8 text-muted text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold" style={{ textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
