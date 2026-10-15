import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { api, getToken, setToken } from '../api/client';

interface AuthState {
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(getToken());

  const login = useCallback(async (email: string, password: string) => {
    const { accessToken } = await api<{ accessToken: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setToken(accessToken);
    setTokenState(accessToken);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenState(null);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ isAuthenticated: Boolean(token), login, logout }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
