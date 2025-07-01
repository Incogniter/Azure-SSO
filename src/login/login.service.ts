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
      scopes: ["user.read", "GroupMember.Read.All"],
      redirectUri: config.AD_BACKEND_REDIRECT_URI,
    };
    return await this.msalClient.getAuthCodeUrl(authCodeUrlParameters);
  }

  async getTokenFromCode(code: string) {
    return await this.msalClient.acquireTokenByCode({
      code,
      scopes: ["user.read", "GroupMember.Read.All"],
      redirectUri: config.AD_BACKEND_REDIRECT_URI,
    });
  }
  
  async refreshAccessToken(refreshToken: string) {
  const response = await this.msalClient.acquireTokenByRefreshToken({
    refreshToken,
    scopes: ["user.read", "GroupMember.Read.All"],
  });

  return {
    accessToken: response?.accessToken,
  };
}

}
