import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext<any>(null);

const BUFFER_TIME = 60 * 1000;

function isTokenExpiringSoon(token: string): boolean {
    try {
        const decoded: any = jwtDecode(token);
        const expiryTime = decoded.exp * 1000;
        return Date.now() > expiryTime - BUFFER_TIME;
    } catch {
        return true;
    }
}

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
            const res = await fetch('http://localhost:1433/auth/refresh', {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Refresh failed');
            console.log('Token refreshed silently');
        } catch (err) {
            console.error('Silent refresh error:', err);
        }
    };

    const getAccessToken = async () => {
        if (!tokens.accessToken || isTokenExpiringSoon(tokens.accessToken)) {
            await refreshToken(); // refreshes only if token is missing or expiring soon
        }
        return tokens.accessToken;
    };

    useEffect(() => {
        const checkAndRefresh = async () => {
            if (tokens.accessToken && isTokenExpiringSoon(tokens.accessToken)) {
                await refreshToken();
            }
        };

        const interval = setInterval(checkAndRefresh, 1 * 60 * 1000);
        return () => clearInterval(interval);
    }, [tokens.accessToken]);


    useEffect(() => {
        if (location.pathname !== '/') {
            fetchMe();
        }

    }, []);

    return (
        <AuthContext.Provider value={{ user, tokens, getAccessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
