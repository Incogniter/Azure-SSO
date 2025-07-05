import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  roles?: string[];
  [key: string]: any; // optional: allows any other fields too
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(req: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', req.getHandler());
    if (!requiredRoles) return true;

    const request = req.switchToHttp().getRequest();
    const decoded = jwtDecode<DecodedToken>(request.cookies.idToken);
    const roles = decoded.roles || [];  

    return requiredRoles.some(role => roles.includes(role));
  }
}
