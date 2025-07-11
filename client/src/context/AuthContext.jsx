// client/src/context/AuthContext.jsx

import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Initialize token from localStorage synchronously so it's available on first render
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // If there's an existing token, set it on axios so all requests include it
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    axios.defaults.headers.common.Authorization = `Bearer ${newToken}`;
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common.Authorization;
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
