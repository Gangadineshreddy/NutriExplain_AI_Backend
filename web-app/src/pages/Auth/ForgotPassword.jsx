import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import toast from 'react-hot-toast';
import { Mail, Lock, ArrowLeft, Send, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    setIsLoading(true);
    try {
      await api.sendOtp({ email });
      toast.success('Verification code sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }
    setIsLoading(true);
    try {
      await api.verifyOtp({ email, otp });
      toast.success('Code verified successfully!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid or expired code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await api.resetPassword({ email, otp, new_password: newPassword });
      toast.success('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Password reset failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="screen-padding flex-column animate-fade-in">
      <button className="back-button mb-8" onClick={() => {
        if (step > 1) setStep(step - 1);
        else navigate(-1);
      }}>
        <ArrowLeft size={24} />
      </button>

      <div className="glass-panel w-full" style={{ marginTop: 'auto', marginBottom: 'auto' }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-primary mb-2">Reset Password</h1>
          <p className="text-muted">
            {step === 1 && "Enter your email to receive a reset code"}
            {step === 2 && "Enter the 6-digit code sent to your email"}
            {step === 3 && "Create a new strong password"}
          </p>
        </div>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="flex-column gap-4 animate-fade-in">
            <div style={{ position: 'relative' }}>
              <Mail size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input 
                type="email" 
                className="glass-input" 
                placeholder="Email Address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ paddingLeft: '48px' }}
              />
            </div>
            <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
              {isLoading ? <div className="loader" /> : <><Send size={20} /> Send Reset Code</>}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="flex-column gap-4 animate-fade-in">
            <div style={{ position: 'relative' }}>
              <KeyRound size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input 
                type="text" 
                className="glass-input" 
                placeholder="6-digit verification code" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                style={{ paddingLeft: '48px', letterSpacing: '4px', textAlign: 'center' }}
                maxLength={6}
              />
            </div>
            <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
              {isLoading ? <div className="loader" /> : 'Verify Code'}
            </button>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="flex-column gap-4 animate-fade-in">
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input 
                type="password" 
                className="glass-input" 
                placeholder="New Password" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingLeft: '48px' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={20} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '14px' }} />
              <input 
                type="password" 
                className="glass-input" 
                placeholder="Confirm New Password" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingLeft: '48px' }}
              />
            </div>
            <button type="submit" className="btn-primary mt-4" disabled={isLoading}>
              {isLoading ? <div className="loader" /> : 'Save Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
