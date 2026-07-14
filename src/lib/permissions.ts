export type Role = "superadmin" | "manager" | "user";

export const PERMISSIONS: Record<Role, string[]> = {
  superadmin: ["rooms.view", "rooms.manage", "rooms.maintenance", "reports.view", "users.view"],
  manager: ["rooms.view", "rooms.maintenance"],
  user: [],
};

export const can = (role: Role, permission: string) => PERMISSIONS[role].includes(permission);
export const isAdmin = (role: Role) => role === "superadmin" || role === "manager";