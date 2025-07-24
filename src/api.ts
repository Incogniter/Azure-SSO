
export const apiFetch = async (endpoint: string, options: RequestInit = {} ,tokens: {
    csrfToken: string;
    accessToken: string;
    idToken: string;
    account: string;
  }) => {  
  const idToken = tokens?.idToken;
  const accessToken = tokens?.accessToken
  const account = tokens?.account
  const csrfToken = tokens?.csrfToken
  
  const headers = {
    Authorization:`Bearer ${accessToken}`,
    'x-id-token': idToken || '',
    'x-account': account || '',
    'x-csrf-token': csrfToken,
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(`https://bannano-api-eha2esbgbkdzdchj.canadacentral-01.azurewebsites.net/${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error('API request failed');
  }

  return response.json();
};
