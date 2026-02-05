import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const login = async (userData) => {
    // Save token/user data to AsyncStorage
    await AsyncStorage.setItem('userToken', userData.token || 'dummy-token');
    await AsyncStorage.setItem('userData', JSON.stringify(userData));
    setIsLoggedIn(true);
    setUser(userData);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUser(null);
  };

  const checkLoginStatus = async () => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      setIsLoggedIn(true);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, checkLoginStatus }}>
      {children}
    </AuthContext.Provider>
  );
};