import React, { createContext, useContext, useState, useEffect } from 'react';
import { memberAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const storedMember = localStorage.getItem('member');

      if (token && storedMember) {
        setMember(JSON.parse(storedMember));
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await memberAPI.login(email, password);
      const { token, member: memberData } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('member', JSON.stringify(memberData));

      setMember(memberData);
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      };
    }
  };

  const register = async (formData) => {
    try {
      const response = await memberAPI.register(formData);
      return { 
        success: true, 
        data: response.data 
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed'
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('member');
    setMember(null);
    setIsAuthenticated(false);
  };

  const value = {
    member,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;