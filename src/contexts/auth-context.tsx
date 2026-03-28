
"use client";

import * as React from 'react';
import type { ReactNode } from 'react';
import { type User, MOCK_CURRENT_USER } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  setAuthInfo: (authInfo: { user: User | null }) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = React.useState<User | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    let mounted = true;
    import('@/lib/actions/auth.actions').then(({ getCurrentUser }) => {
        getCurrentUser().then(sessionUser => {
            if (mounted) {
                setUser(sessionUser);
                setIsLoading(false);
            }
        });
    });
    return () => { mounted = false; };
  }, []);

  const setAuthInfo = ({ user: newUser }: { user: User | null }) => {
    setUser(newUser);
  };

  const logout = async () => {
    const { logoutUser } = await import('@/lib/actions/auth.actions');
    await logoutUser();
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, setAuthInfo, logout }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
