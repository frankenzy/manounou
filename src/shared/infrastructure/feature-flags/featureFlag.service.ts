import { prisma } from "@/shared/infrastructure/db/prisma/client";

export class FeatureFlagService {
   async isEnabled(workspaceId: string, flagKey: string): Promise<boolean> {
      const row = await prisma.workspaceFeatureFlag.findUnique({
         where: {
            workspaceId_flagKey: {
               workspaceId,
               flagKey,
            },
         },
         select: {
            enabled: true,
         },
      });

      return !!row?.enabled;
   }
}
