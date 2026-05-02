import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';

// Pages
import Onboarding from './pages/Onboarding';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import ForgotPassword from './pages/Auth/ForgotPassword';
import HealthProfile from './pages/ProfileSetup/HealthProfile';
import LifestyleHabits from './pages/ProfileSetup/LifestyleHabits';
import MedicalConditions from './pages/ProfileSetup/MedicalConditions';
import Home from './pages/Dashboard/Home';
import Profile from './pages/Dashboard/Profile';
import History from './pages/Dashboard/History';
import Scan from './pages/Scan/Scan';
import Analyzing from './pages/Scan/Analyzing';
import Result from './pages/Scan/Result';
import EditProfile from './pages/Dashboard/EditProfile';

// Layout
import BottomNav from './components/BottomNav';

const ProtectedRoute = ({ children }) => {
  const { userId, loading } = useAuth();
  if (loading) return <div className="loader" style={{margin: 'auto', marginTop: '50vh'}}></div>;
  if (!userId) return <Navigate to="/login" />;
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
};

function App() {
  return (
    <div className="app-container">
      <BrowserRouter>
        <Toaster position="top-center" toastOptions={{
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
          }
        }}/>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          <Route path="/health-profile" element={<HealthProfile />} />
          <Route path="/medical-conditions" element={<MedicalConditions />} />
          <Route path="/lifestyle" element={<LifestyleHabits />} />

          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/edit-profile" element={<ProtectedRoute><EditProfile /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          
          <Route path="/scan" element={<ProtectedRoute><Scan /></ProtectedRoute>} />
          <Route path="/analyzing" element={<ProtectedRoute><Analyzing /></ProtectedRoute>} />
          <Route path="/result" element={<ProtectedRoute><Result /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
