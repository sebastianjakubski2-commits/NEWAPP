import React, { createContext, useContext, useState, ReactNode } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { Uczestnik } from './types';

interface AuthContextType {
  token: string | null;
  uczestnik: Uczestnik | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [uczestnik, setUczestnik] = useState<Uczestnik | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const login = async (newToken: string) => {
    setIsLoading(true);
    try {
      const docRef = doc(db, 'Uczestnicy', newToken);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data() as Omit<Uczestnik, 'Token'>;
        setUczestnik({
          Token: docSnap.id,
          ...data,
        });
        setToken(newToken);
      } else {
        // Handle case where document doesn't exist
        console.warn('Uczestnik nie znaleziony');
        setUczestnik(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Błąd logowania:', error);
      setUczestnik(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ token, uczestnik, isLoading, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
