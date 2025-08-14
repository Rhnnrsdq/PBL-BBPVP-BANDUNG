import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { getUsers } from '../data/mockData';
import { setStorageItem, getStorageItem } from '../utils/storage';
import { saveUserRegistration } from '../utils/googleSheetsApi';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'created_at'>) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedUser = getStorageItem('currentUser');
    if (savedUser) {
      setUser(savedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const users = getUsers();
      const foundUser = users.find(u => u.email === email && u.password_hash === password);
      
      if (foundUser) {
        setUser(foundUser);
        setIsAuthenticated(true);
        setStorageItem('currentUser', foundUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id' | 'created_at'>): Promise<boolean> => {
    try {
      const users = getUsers();
      const existingUser = users.find(u => u.email === userData.email);
      
      if (existingUser) {
        return false; // User already exists
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };

      const updatedUsers = [...users, newUser];
      setStorageItem('users', updatedUsers);
      
      // Save to Google Sheets
      await saveUserRegistration({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        password: userData.password_hash,
        timestamp: newUser.created_at
      });
      
      setUser(newUser);
      setIsAuthenticated(true);
      setStorageItem('currentUser', newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setStorageItem('currentUser', null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}