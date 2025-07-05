const ROLE_HIERARCHY: Record<string, string[]> = {
  Admin: ['Manager', 'User'],
  Manager: ['User'],
  User: []
};


export function resolveInheritedRoles(role: string): string[] {
  const visited = new Set<string>();

  function dfs(r: string) {
    if (visited.has(r)) return;
    visited.add(r);
    for (const child of ROLE_HIERARCHY[r] || []) {
      dfs(child);
    }
  }

  dfs(role);
  return Array.from(visited);
}
