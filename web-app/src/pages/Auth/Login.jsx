import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { Lock, Mail, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.login({ email, password });
      login(res.data.user_id, res.data.full_name);
      toast.success('Login successful!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-padding flex-center animate-fade-in">
      <div className="glass-panel w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Welcome Back</h1>
          <p className="text-muted">Sign in to continue your health journey</p>
        </div>

        <form onSubmit={handleLogin} className="flex-column gap-4">
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

          <div className="flex-between mt-2">
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" style={{ color: 'var(--primary-green)', textDecoration: 'none', fontSize: '14px' }}>
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
            {isLoading ? <div className="loader" /> : <><LogIn size={20} /> Sign In</>}
          </button>
        </form>

        <p className="text-center mt-8 text-muted text-sm">
          Don't have an account?{' '}
          <Link to="/signup" className="text-primary font-semibold" style={{ textDecoration: 'none' }}>
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
