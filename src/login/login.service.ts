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
      scopes: ["user.read", "GroupMember.Read.All","User.Read.All","email"],
      redirectUri: config.AD_BACKEND_REDIRECT_URI,
      //  prompt: "consent",
    };
    return await this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
  }

  async getTokenFromCode(code: string) {
    return await this.msalClient.acquireTokenByCode({
      code,
      scopes: ["user.read", "GroupMember.Read.All","User.Read.All","email"],
      redirectUri: config.AD_BACKEND_REDIRECT_URI,
    });
  }

  async refreshAccessToken(account: any) {
    const tokenRequest = {
      scopes: ['user.read', 'GroupMember.Read.All',"User.Read.All","email"],
      account: account,
      forceRefresh: true,
    };

    const response = await this.msalClient.acquireTokenSilent(tokenRequest);

    return {
      accessToken: response.accessToken,
      idToken: response.idToken,
      account: response.account,
    };
  }



}
