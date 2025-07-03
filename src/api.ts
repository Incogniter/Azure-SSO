import { useAuth } from './AuthContext';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const { tokens } = useAuth();

  const idToken = tokens?.idToken;
  const accessToken = tokens?.accaccessToken
  const account = tokens?.account

  const headers = {
    Authorization: tokens ? `Bearer ${accessToken}` : '',
    'x-id-token': idToken || '',
    'x-account': account || '',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`http://localhost:1433/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
};
