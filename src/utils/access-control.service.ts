import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { jwtDecode } from "jwt-decode";
import { resolvePermissions } from "./role-permissions";

interface RequestWithCookies extends Request {
  cookies: { [key: string]: string };
}
@Injectable({ scope: Scope.REQUEST }) 
export class AccessControlService {
  constructor(@Inject(REQUEST) private readonly request: RequestWithCookies) {}

  canUserAccess(action: string): boolean {
    const idToken = this.request.cookies?.idToken;
    if (!idToken) return false;

    const decoded: any = jwtDecode(idToken);
    const userRoles = decoded?.roles || [];

    const permissions = new Set<string>();
    for (const role of userRoles) {
      const rolePerms = resolvePermissions(role);
      rolePerms.forEach((p) => permissions.add(p));
    }    
    return permissions.has(action);
  }

  // canAccessResource(userId: string, resourceOwnerId: string): boolean {
  //   return userId === resourceOwnerId;
  // }
}


