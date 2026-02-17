export const GLOBAL_ROLES = {
   USER: "USER",
   ADMIN: "ADMIN",
   SUPER_ADMIN: "SUPER_ADMIN",
} as const;

export const WORKSPACE_ROLES = {
   OWNER: "OWNER",
   ADMIN: "ADMIN",
   MEMBER: "MEMBER",
   VIEWER: "VIEWER",
} as const;

export type GlobalRole = (typeof GLOBAL_ROLES)[keyof typeof GLOBAL_ROLES];
export type WorkspaceRole = (typeof WORKSPACE_ROLES)[keyof typeof WORKSPACE_ROLES];
