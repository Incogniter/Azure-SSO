import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { jwtDecode } from 'jwt-decode';
import { resolvePermissions } from '../utils/role-permissions';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', ctx.getHandler());
    if (!requiredPermissions) return true;

    const request = ctx.switchToHttp().getRequest();
    const idToken = request.cookies?.idToken;
    if (!idToken) return false;

    const decoded: any = jwtDecode(idToken);
    const userRoles = decoded?.roles || [];

    const userPermissions = new Set<string>();
    for (const role of userRoles) {
      const perms = resolvePermissions(role);
      perms.forEach(p => userPermissions.add(p));
    }

    return requiredPermissions.some(p => userPermissions.has(p));
  }
}
