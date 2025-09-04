import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { fetchUsers, createUser } from '../utils/googleSheetsApi';
import { setStorageItem, getStorageItem } from '../utils/storage';

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
      const result = await fetchUsers();
      if (!result.success) {
        console.error('Failed to fetch users:', result.error);
        return false;
      }
      
      const users = result.data || [];
      const foundUser = users.find((u: any) => u.email === email && u.password_hash === password);
      
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
      const result = await fetchUsers();
      if (!result.success) {
        console.error('Failed to fetch users:', result.error);
        return false;
      }
      
      const users = result.data || [];
      const existingUser = users.find((u: any) => u.email === userData.email);
      
      if (existingUser) {
        return false; // User already exists
      }

      const newUser: User = {
        ...userData,
        id: Date.now().toString(),
        created_at: new Date().toISOString()
      };

      // Save to Google Sheets
      const createResult = await createUser(newUser);
      if (!createResult.success) {
        console.error('Failed to create user:', createResult.error);
        return false;
      }
      
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