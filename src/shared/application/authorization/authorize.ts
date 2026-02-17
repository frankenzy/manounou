import {
   Permission,
   WORKSPACE_ROLE_PERMISSIONS,
} from "@/shared/domain/authorization/permissions";
import { WorkspaceRole } from "@/shared/domain/authorization/roles";

export function hasPermission(role: WorkspaceRole, permission: Permission): boolean {
   const permissions = WORKSPACE_ROLE_PERMISSIONS[role] ?? [];
   return permissions.includes(permission);
}

export function assertPermission(role: WorkspaceRole, permission: Permission): void {
   if (!hasPermission(role, permission)) {
      throw new Error("Forbidden");
   }
}
