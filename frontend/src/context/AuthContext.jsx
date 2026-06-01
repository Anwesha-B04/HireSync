import React, { createContext, useContext, useState } from 'react';
import {
  clearAuth,
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken,
  setUser as persistUser,
} from '../utils/jwtStorage';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

function storeAuth(token, user) {
  if (token) {
    setToken(token);
  } else {
    removeToken();
  }

  if (user) {
    persistUser(user);
  } else {
    removeUser();
  }
}

export const AuthProvider = ({ children }) => {
  const [token, setTokenState] = useState(() => getToken());
  const [user, setUserState] = useState(() => getUser());

  const applyAuth = (nextToken, nextUser) => {
    storeAuth(nextToken, nextUser);
    setTokenState(nextToken || null);
    setUserState(nextUser || null);
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);

    if (data?.token) {
      applyAuth(data.token, data.user || null);
    }

    return data;
  };

  const registerStudent = async (payload) => {
    const data = await authService.registerStudent(payload);

    if (data?.token) {
      applyAuth(data.token, data.user || null);
    }

    return data;
  };

  const registerCompany = async (payload) => {
    const data = await authService.registerCompany(payload);

    if (data?.token) {
      applyAuth(data.token, data.user || null);
    }

    return data;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Clear local session even if the server call fails.
    }

    clearAuth();
    setTokenState(null);
    setUserState(null);
  };

  const value = {
    token,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
    registerStudent,
    registerCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
