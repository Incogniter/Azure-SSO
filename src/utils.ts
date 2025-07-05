import * as jose from 'jose';
import { Client } from '@microsoft/microsoft-graph-client';
import { jwtDecode } from 'jwt-decode';
import config from './main_congig'; 

const tenantId = process.env.TENANT_ID;
const AZURE_OPENID_CONFIG_URL = `https://login.microsoftonline.com/${tenantId}/v2.0/.well-known/openid-configuration`;

export async function validateAzureIdToken(idToken: string): Promise<boolean> {
  try {
    // Step 1: Get OpenID config to find JWKS URI
    const openidConfig = await fetch(AZURE_OPENID_CONFIG_URL).then(res => res.json());
    const jwksUri = openidConfig.jwks_uri;

    // Step 2: Fetch the JWKS (Azure's public keys)
    const jwksResponse = await fetch(jwksUri);
    const jwks = await jwksResponse.json();

    // Step 3: Decode header to find the key ID (kid)
    const [headerBase64] = idToken.split('.');
    const headerJson = Buffer.from(headerBase64, 'base64url').toString();
    const { kid, alg } = JSON.parse(headerJson);

    // Step 4: Find the matching public key
    const jwk = jwks.keys.find((key: any) => key.kid === kid);
    if (!jwk) throw new Error('No matching JWK found');

    // Step 5: Verify the JWT using JOSE
    const key = await jose.importJWK(jwk, alg);
    const { payload } = await jose.jwtVerify(idToken, key);

    // Step 6: Optionally check expiration manually (extra safety)
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) throw new Error('Token expired');

    return true;
  } catch (err) {
    console.error('Azure token validation failed:', err.message);
    return false;
  }
}

export async function isUserInAzureGroup(accessToken: string): Promise<boolean> {
  const groupId = config.GROUP_ID;

  const client = Client.init({
    authProvider: (done) => {
      done(null, accessToken);
    },
  });

  const decodedToken = jwtDecode(accessToken) as any;
  const userId = decodedToken?.oid;

  if (!userId) {
    console.error('User ID (oid) not found in access token');
    return false;
  }

  try {
    const members = await client
      .api(`/groups/${groupId}/members`)
      .version('v1.0')
      .filter(`id eq '${userId}'`)
      .count(true)
      .get();

    return members.value.length > 0;
  } catch (error: any) {
    console.error('Error checking Azure AD group membership:', error.message);
    return false;
  }
}

