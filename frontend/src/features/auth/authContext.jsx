import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authService } from './service/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    const token = localStorage.getItem('sahyog_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { user } = await authService.getMe();
      setUser(user);
    } catch {
      localStorage.removeItem('sahyog_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = async (payload) => {
    const { user, token } = await authService.login(payload);
    localStorage.setItem('sahyog_token', token);
    setUser(user);
    return user;
  };

  const register = async (payload) => {
    const { user, token } = await authService.register(payload);
    localStorage.setItem('sahyog_token', token);
    setUser(user);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('sahyog_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);