import { resolveInheritedRoles } from "./role-hierarchy";

const ROLE_PERMISSIONS: Record<string, string[]> = {
  Admin: ['user:create', 'user:edit', 'user:delete', 'invoice:delete'],
  Manager: ['user:edit', 'invoice:view'],
  User: ['invoice:view']
};

export function resolvePermissions(role: string): string[] {
  const roles = resolveInheritedRoles(role); 
  const permissions = new Set<string>();

  for (const r of roles) {
    const perms = ROLE_PERMISSIONS[r] || [];
    perms.forEach(p => permissions.add(p));
  }

  return Array.from(permissions);
}
