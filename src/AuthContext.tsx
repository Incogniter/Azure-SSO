import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';


const AuthContext = createContext<any>(null);

const BUFFER_TIME = 10 * 60 * 1000;

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
    const [tokens, setTokens] = useState<{ accessToken?: string, idToken?: string, account?: {} }>({});
    const inactivityTimeout = useRef<any>(null);
    const isLoggingOut = useRef(false); 



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
                    idToken: data.idToken,
                    account: data.account
                });
            } else {
                console.warn('Auth check failed', data);
            }
        } catch (err) {
            console.error('Fetch /auth/me failed', err);
        }
    };

    const refreshToken = async () => {
         if (isLoggingOut.current) return;
        try {
            const res = await fetch('http://localhost:1433/auth/refresh', {
                credentials: 'include',
            });
            if (!res.ok) throw new Error('Refresh failed');
            fetchMe()
        } catch (err) {
            console.error('Silent refresh error:', err);
        }
    };

    const logout = async () => {
        isLoggingOut.current = true;
        try {
            await fetch('http://localhost:1433/auth/logout', { credentials: 'include',method: 'POST', });
        } catch { }
        setUser(null);
        setTokens({});
        window.location.href = '/'; 
    };

    const startInactivityTimer = () => {
        if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
        inactivityTimeout.current = setTimeout(() => {
            if (tokens.accessToken && isTokenExpiringSoon(tokens.accessToken)) {
                logout();
            }
        }, 5 * 60 * 1000); 
    };

    useEffect(() => {
        const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];

        events.forEach(event =>
            window.addEventListener(event, startInactivityTimer)
        );

        startInactivityTimer(); 

        return () => {
            events.forEach(event =>
                window.removeEventListener(event, startInactivityTimer)
            );
            clearTimeout(inactivityTimeout.current);
        };
    }, [tokens.accessToken]);

        useEffect(() => {
        const interval = setInterval(() => {
            if (tokens.accessToken && isTokenExpiringSoon(tokens.accessToken)) {
                refreshToken(); 
            }
        }, 2 * 60 * 1000); 

        return () => clearInterval(interval);
    }, [tokens.accessToken]);


    useEffect(() => {
        if (location.pathname !== '/') {
            fetchMe();
        }

    }, []);

    return (
        <AuthContext.Provider value={{ user, tokens }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
