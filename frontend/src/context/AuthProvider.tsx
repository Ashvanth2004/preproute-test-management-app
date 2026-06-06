import React, { useState, useCallback } from 'react';
import { AuthContext } from './AuthContext';
import type { AuthContextType } from './AuthContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));

  const login = useCallback((callback?: () => void) => {
    localStorage.setItem('authToken', 'dummy-token');
    setIsAuthenticated(true);
    if (callback) callback();
  }, []);

  const logout = useCallback((callback?: () => void) => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    if (callback) callback();
  }, []);

  const value: AuthContextType = { isAuthenticated, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};