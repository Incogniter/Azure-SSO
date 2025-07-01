import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from './login.service';
import config from '../main_congig';
import { isUserInAzureGroup, validateAzureIdToken } from 'src/utils';

@Controller('auth')
export class LoginController {
  constructor(private readonly loginService: LoginService) { }

  // 1. Start Azure login by redirecting to Microsoft login URL
  @Get('microsoft_login')
  async loginToAzure(@Res() res: Response) {
    try {
      const authUrl = await this.loginService.getLoginUrl();
      return res.redirect(authUrl);
    } catch (error) {
      throw new HttpException('Failed to get Azure login URL', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // 2. Handle redirect from Azure AD
  @Get('redirect')
  async handleAzureRedirect(@Query('code') code: string, @Res() res: Response) {
    
    try {
      const tokenResponse = await this.loginService.getTokenFromCode(code);      
      const accessToken = tokenResponse.accessToken;
      const idToken = tokenResponse.idToken

      const isValid = await validateAzureIdToken(idToken);
      if (!isValid) {
        return res.status(401).send('Invalid ID Token');
      }
      const isInGroup = await isUserInAzureGroup(accessToken);
      if (!isInGroup) {
        return res.status(403).send('Access Denied: Not in required Azure group');
      }

      // Optional: store in cookies
      res.cookie('authToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      // Optional: redirect to frontend with user info
      return res.redirect(`${config.AD_FRONTEND_REDIRECT_URI}?login=success`);
    } catch (error) {
      console.error('Redirect Error:', error);
      return res.status(500).send('Login failed');
    }
  }
  @Get('refresh')
  async refreshToken(@Res() res: Response, @Query() query: any) {
    const refreshToken = query.token || res.req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).send('Refresh token missing');
    }

    try {
      const newTokens = await this.loginService.refreshAccessToken(refreshToken);

      // Update accessToken cookie
      res.cookie('authToken', newTokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return res.status(200).send('Token refreshed');
    } catch (error) {
      return res.status(401).send('Failed to refresh token');
    }
  }

}
