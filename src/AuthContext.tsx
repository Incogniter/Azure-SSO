import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from './api';


const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState<{ accessToken?: string, idToken?: string }>({});

  const fetchMe = async () => {
    try {
      const res = await fetch('http://localhost:1433/auth/me', {
        credentials: 'include',
      });
      const data = await res.json();

      if (res.ok) {
        setUser(data.user.name);        
        setTokens({
          accessToken: data.accessToken,
          idToken: data.idToken
        });
      } else {
        console.warn('Auth check failed', data);
      }
    } catch (err) {
      console.error('Fetch /auth/me failed', err);
    }
  };

  const refreshToken = async () => {
    try {
      const res = await apiFetch('auth/refresh', {
      });
      if (res.ok) {
        await fetchMe();
      } else {
        console.warn('Token refresh failed');
      }
    } catch (err) {
      console.error('Token refresh error', err);
    }
  };

useEffect(() => {

  if (location.pathname !== '/') {
    fetchMe();
    const interval = setInterval(refreshToken, 0.1 * 60 * 1000); // 10 minutes
    return () => clearInterval(interval);
  }
}, []);

  return (
    <AuthContext.Provider value={{ user, tokens, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
