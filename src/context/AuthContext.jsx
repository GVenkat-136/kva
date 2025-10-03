import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/authApi.js';

export const AuthContext = createContext({ user: null, loading: false, initializing: true, login: async () => {}, logout: () => {} });

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('kva_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch {}
    }
    setInitializing(false);
  }, []);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    try {
      const result = await apiLogin(username, password);
      setUser(result);
      localStorage.setItem('kva_user', JSON.stringify(result));
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    apiLogout();
    setUser(null);
    localStorage.removeItem('kva_user');
  }, []);

  const value = useMemo(() => ({ user, loading, initializing, login, logout }), [user, loading, initializing, login, logout]);
  
  if (initializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}



