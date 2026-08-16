export type Role = "superadmin" | "manager" | "user";

export const PERMISSIONS: Record<Role, string[]> = {
  superadmin: [
    "buildings.manage",
    "rooms.view",
    "rooms.manage",
    "rooms.delete",
    "rooms.maintenance",
    "kroki.manage",
    "qr.manage",
    "reports.view",
    "users.view",
    "users.manage",
    "complaints.manage",
    "approvals.manage",
  ],
  manager: [
    "rooms.view",
    "rooms.manage",
    "rooms.delete",
    "rooms.maintenance",
    "kroki.manage",
    "qr.manage",
    "reports.view",
    "users.view",
    "complaints.manage",
    "approvals.manage",
  ],
  user: [],
};

export const can = (role: Role, permission: string) => PERMISSIONS[role].includes(permission);
export const isAdmin = (role: Role) => role === "superadmin" || role === "manager";