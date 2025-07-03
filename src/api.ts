import { useAuth } from './AuthContext';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const { tokens } = useAuth();
  const token = tokens?.accessToken;
  const idToken = tokens?.idToken;
  const account = localStorage.getItem('account');

  const headers = {
    Authorization: token ? `Bearer ${token}` : '',
    'x-id-token': idToken || '',
    'x-account': account || '',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`http://localhost:1433/${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
};
