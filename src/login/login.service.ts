import { Injectable } from '@nestjs/common';
import { ConfidentialClientApplication } from '@azure/msal-node';
import config from "../main_congig";

@Injectable()
export class LoginService {
  private readonly msalClient: ConfidentialClientApplication;

  constructor() {
    this.msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: config.CLIENT_ID,
        authority: `https://login.microsoftonline.com/${config.TENANT_ID}`,
        clientSecret: config.CLIENT_SECRET,
      },
    });
  }

  async getLoginUrl(): Promise<string> {
    const authCodeUrlParameters = {
      scopes: ["user.read", "GroupMember.Read.All",'offline_access',],
      redirectUri: config.AD_BACKEND_REDIRECT_URI,
       prompt: "consent",
    };
    return await this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
  }

  async getTokenFromCode(code: string) {
    return await this.msalClient.acquireTokenByCode({
      code,
      scopes: ["user.read", "GroupMember.Read.All",'offline_access',],
      redirectUri: config.AD_BACKEND_REDIRECT_URI,
    });
  }
  
//   async refreshAccessToken(account: { homeAccountId: string }) {
//        const tokenCache = this.msalClient.getTokenCache();
//   const acc = await tokenCache.getAccountByHomeId(account.homeAccountId);

//   if (!acc) {
//     throw new Error('Account not found in cache');
//   }

//   const result = await this.msalClient.acquireTokenSilent({
//     account: acc, 
//     scopes: ['user.read', 'GroupMember.Read.All', 'openid', 'profile', 'email'],
//   });

//   return {
//     accessToken: result.accessToken,
//     idToken: result.idToken,
//     expiresOn: result.expiresOn,
//     account: result.account?.homeAccountId,
//   };
// }


}
