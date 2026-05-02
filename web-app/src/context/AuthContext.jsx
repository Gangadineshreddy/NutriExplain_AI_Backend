import React, { createContext, useState, useEffect, useContext } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId') || null);
  const [userName, setUserName] = useState(() => localStorage.getItem('userName') || null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      localStorage.setItem('userId', userId);
      // Fetch profile
      api.getProfile(userId)
        .then(res => setUserProfile(res.data))
        .catch(err => console.error("Error fetching profile", err))
        .finally(() => setLoading(false));
    } else {
      localStorage.removeItem('userId');
      localStorage.removeItem('userName');
      setUserProfile(null);
      setLoading(false);
    }
  }, [userId]);

  const login = (id, name) => {
    setUserId(id);
    setUserName(name);
    localStorage.setItem('userName', name);
  };

  const logout = () => {
    setUserId(null);
    setUserName(null);
  };

  const refreshProfile = async () => {
    if (userId) {
      try {
        const res = await api.getProfile(userId);
        setUserProfile(res.data);
      } catch (err) {
        console.error("Error refreshing profile", err);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ userId, userName, userProfile, login, logout, refreshProfile, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
