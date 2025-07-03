import { useAuth } from './AuthContext';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  const { getAccessToken, tokens } = useAuth();

  const token = await getAccessToken(); 
  const idToken = tokens?.idToken;
  const accessToken = token?.ccessToken
  const account = localStorage.getItem('account');

  const headers = {
    Authorization: token ? `Bearer ${accessToken}` : '',
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
