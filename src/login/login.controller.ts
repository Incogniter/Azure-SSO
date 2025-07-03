import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from './login.service';
import config from '../main_congig';
import { isUserInAzureGroup, validateAzureIdToken } from 'src/utils';
import { CookieOrHeaderAuthGuard } from './authGuard';
import { Request } from 'express';


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
      const accounts = tokenResponse.account

      const isValid = await validateAzureIdToken(idToken);
      if (!isValid) {
        return res.status(401).send('Invalid ID Token');
      }
      const isInGroup = await isUserInAzureGroup(accessToken);
      if (!isInGroup) {
        return res.status(403).send('Access Denied: Not in required Azure group');
      }
      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
      });
      res.cookie('idToken', idToken, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
      });
      res.cookie('account', accounts, {
        httpOnly: false,
        secure: false,
        sameSite: 'lax',
      });

      return res.redirect(`${config.AD_FRONTEND_REDIRECT_URI}`);
    } catch (error) {
      console.error('Redirect Error:', error);
      return res.status(500).send('Login failed');
    }
  }
  // @Get('refresh')
  // async refreshToken(@Req() req: Request, @Res() res: Response) {
  //   const cookies = req.cookies;
  //   const accountCookie = cookies?.account;

  // if (!accountCookie) {
  //   return res.status(401).send('Account info missing');
  // }

  //   let account;
  //   try {
  //     account = JSON.parse(accountCookie);      
  //   } catch {
  //     return res.status(400).send('Invalid account format');
  //   }

  //   try {
  //     const newTokens = await this.loginService.refreshAccessToken(account);

  //     res.cookie('accessToken', newTokens.accessToken, { httpOnly: false, secure: false, sameSite: 'lax' });
  //     res.cookie('idToken', newTokens.idToken, { httpOnly: false, secure: false, sameSite: 'lax' });
  //     res.cookie('account', JSON.stringify(newTokens.account), { httpOnly: false, secure: false, sameSite: 'lax' });

  //     return res.status(200).send('Token refreshed');
  //   } catch (error) {
  //     console.error('Refresh error:', error);
  //     return res.status(401).send('Failed to refresh token');
  //   }
  // }


  @UseGuards(CookieOrHeaderAuthGuard)
  @Get('me')
  getMe(@Req() req: Request) {
    return {
      message: 'Authenticated',
      user: req['user'],
    };
  }


}