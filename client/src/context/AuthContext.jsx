import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('ry_admin_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentAdmin = async () => {
      const storedToken = localStorage.getItem('ry_admin_token');
      if (!storedToken) {
        setAdmin(null);
        setLoading(false);
        return;
      }

      try {
        const response = await api.get('/auth/me');
        if (response.data?.success) {
          setAdmin(response.data.admin);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session expired or invalid token:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentAdmin();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      if (response.data?.success && response.data?.token) {
        localStorage.setItem('ry_admin_token', response.data.token);
        setToken(response.data.token);
        setAdmin(response.data.admin);
        return { success: true };
      }
      return { success: false, message: response.data?.message || 'Login failed.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('ry_admin_token');
      setToken(null);
      setAdmin(null);
    }
  };

  const updateWorkStatus = async (status) => {
    try {
      const response = await api.put('/auth/work-status', { status });
      if (response.data?.success) {
        setAdmin((prev) => (prev ? { ...prev, workStatus: status } : prev));
        return { success: true, workStatus: status };
      }
      return { success: false, message: response.data?.message || 'Status update failed.' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        isAuthenticated: !!token && !!admin,
        loading,
        login,
        logout,
        updateWorkStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
