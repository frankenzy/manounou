import { NextRequest } from "next/server";

export type TenantContext = {
   workspaceId: string;
   userId?: string;
};

export function getTenantContext(request: NextRequest): TenantContext {
   const workspaceId =
      request.headers.get("x-tenant-id") ||
      request.headers.get("x-workspace-id") ||
      request.cookies.get("tenantId")?.value ||
      "public";

   const userId = request.headers.get("x-user-id") || request.cookies.get("userId")?.value;

   return {
      workspaceId,
      userId: userId || undefined,
   };
}
