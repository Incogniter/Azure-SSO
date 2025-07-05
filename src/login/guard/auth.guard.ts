import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';
import { validateAzureIdToken, isUserInAzureGroup } from 'src/utils/utils';

@Injectable()
export class CookieOrHeaderAuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        let accessToken = request.headers['authorization']?.toString().replace(/^Bearer\s/, '');
        let idToken = request.headers['x-id-token'] as string;
        let account = request.headers['x-account']

        // if (!accessToken || !idToken) {
        //     accessToken = request.cookies['accessToken'];
        //     idToken = request.cookies['idToken'];
        // }

        if (!accessToken || !idToken) {
            throw new UnauthorizedException('Missing tokens');
        }

        const isValid = await validateAzureIdToken(idToken);
        if (!isValid) throw new UnauthorizedException('Invalid ID token');

        const isMember = await isUserInAzureGroup(accessToken);
        if (!isMember) throw new UnauthorizedException('User not in required group');

        const decoded = jwtDecode<{ email: string; name: string }>(idToken);        
        request['user'] = {
            email: decoded.email,
            name: decoded.name,
            accessToken: accessToken,
            idToken: idToken,
            account: account
        };

        return true;
    }
}
