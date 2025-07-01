import {
    CanActivate,
    ExecutionContext,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { jwtDecode } from 'jwt-decode';
import { isUserInAzureGroup, validateAzureIdToken } from 'src/utils';



@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();

        const authHeader = request.headers['authorization'];
        const accessToken = authHeader?.startsWith('Bearer ')
            ? authHeader.slice(7)
            : null;

        if (!accessToken) {
            throw new UnauthorizedException('Access token not found in Authorization header');
        }

        const idToken = request.headers['x-id-token'] as string;

        if (!idToken) {
            throw new UnauthorizedException('ID token not provided');
        }

        const isValid = await validateAzureIdToken(idToken);
        if (!isValid) {
            throw new UnauthorizedException('Invalid ID Token');
        }

        const isMember = await isUserInAzureGroup(accessToken);
        if (!isMember) {
            throw new ForbiddenException('User not in required Azure group');
        }
        interface AzureIdToken {
            email: string;
            name: string;
            oid: string;
        }
        const decoded = jwtDecode<AzureIdToken>(idToken);
        const { email, name, oid } = decoded;
        request['user'] = { email, name };

        return true;
    }
}

// @Get()
// getProfile(@Req() request: Request) {
//   console.log(request['user']); // { email: "...", name: "..." }
//   return request['user'];
// }
