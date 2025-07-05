import {
  Controller,
  Get,
  Query,
  Res,
  HttpException,
  HttpStatus,
  Req,
  UseGuards,
  Post,
} from '@nestjs/common';
import { Response } from 'express';
import { LoginService } from './login.service';
import config from '../main_congig';
import { isUserInAzureGroup, validateAzureIdToken } from 'src/utils';
import { Request } from 'express';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guard/roles.guard';
import { PermissionsGuard } from './guard/permissions.gaurd';
import { Permissions } from './decorators/permissions.decorator';


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
      const account = tokenResponse.account

      const isValid = await validateAzureIdToken(idToken);
      if (!isValid) {
        return res.status(401).send('Invalid ID Token');
      }
      const isInGroup = await isUserInAzureGroup(accessToken);
      if (!isInGroup) {
        return res.status(403).send('Access Denied: Not in required Azure group');
      }
      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        // maxAge: 5 * 1000, 
      });

      res.cookie('idToken', idToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        // maxAge: 5 * 1000,
      });

      res.cookie('account', JSON.stringify(account), {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        // maxAge: 5 * 1000,
      });


      return res.redirect(`${config.AD_FRONTEND_REDIRECT_URI}`);
    } catch (error) {
      console.error('Redirect Error:', error);
      return res.status(500).send('Login failed');
    }
  }

  @Get('refresh')
  async refreshToken(@Req() req: Request, @Res() res: Response) {
    const accountCookie = req.cookies?.account;

    if (!accountCookie) {
      return res.status(401).send('No account cookie found');
    }
    let account;
    try {
      account = JSON.parse(accountCookie);
    } catch {
      return res.status(400).send('Invalid account format');
    }

    try {
      const newTokens = await this.loginService.refreshAccessToken(account);

      res.cookie('accessToken', newTokens.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.cookie('idToken', newTokens.idToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      res.cookie('account', JSON.stringify(newTokens.account), {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return res.status(200).json({ message: 'Tokens refreshed' });
    } catch (error) {
      console.error('Token refresh failed:', error);
      return res.status(401).send('Token refresh failed');
    }
  }
  @Post('logout')
  logout(@Res() res: Response) {
    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.clearCookie('idToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    res.clearCookie('account', {
      secure: true,
      sameSite: 'none',
    });
    res.status(200).send('Logged out');
  }
  @UseGuards(RolesGuard, PermissionsGuard)
  @Permissions(('invoice:view '))
  @Roles('Manager')
  @Get('me')
  getMe(@Req() req: Request) {
    const accessToken = req.cookies?.accessToken;
    const idToken = req.cookies?.idToken;
    const account = req.cookies?.account;

    if (!accessToken || !idToken || !account) {
      return {
        user: null,
        accessToken: null,
        idToken: null,
        account: null
      };
    }
    const decoded = JSON.parse(Buffer.from(idToken.split('.')[1], 'base64').toString());
    return {
      user: {
        name: decoded.name,
        email: decoded.email,
      },
      accessToken,
      idToken,
      account
    };
  }


}