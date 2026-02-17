import {
   Announcement,
   CreateAnnouncementInput,
   UpdateAnnouncementInput,
} from "@/modules/announcements/domain/entities/Announcement";
import {
   AnnouncementQuery,
   AnnouncementRepository,
} from "@/modules/announcements/domain/repositories/AnnouncementRepository";
import { prisma } from "@/shared/infrastructure/db/prisma/client";

export class PrismaAnnouncementRepository implements AnnouncementRepository {
   async list(query: AnnouncementQuery): Promise<Announcement[]> {
      const page = query.page ?? 1;
      const limit = query.limit ?? 20;
      const skip = (page - 1) * limit;

      const rows = await prisma.announcement.findMany({
         where: {
            workspaceId: query.workspaceId,
            OR: query.search
               ? [
                  { title: { contains: query.search, mode: "insensitive" } },
                  { description: { contains: query.search, mode: "insensitive" } },
               ]
               : undefined,
         },
         orderBy: { createdAt: "desc" },
         skip,
         take: limit,
      });

      return rows;
   }

   async findById(workspaceId: string, id: string): Promise<Announcement | null> {
      const row = await prisma.announcement.findFirst({
         where: { id, workspaceId },
      });
      return row;
   }

   async create(input: CreateAnnouncementInput): Promise<Announcement> {
      return prisma.announcement.create({
         data: {
            workspaceId: input.workspaceId,
            authorId: input.authorId,
            title: input.title,
            description: input.description,
            location: input.location,
            metadata: input.metadata,
         },
      });
   }

   async update(
      workspaceId: string,
      id: string,
      input: UpdateAnnouncementInput,
   ): Promise<Announcement | null> {
      const existing = await prisma.announcement.findFirst({
         where: { id, workspaceId },
         select: { id: true },
      });

      if (!existing) {
         return null;
      }

      return prisma.announcement.update({
         where: { id },
         data: {
            title: input.title,
            description: input.description,
            location: input.location,
            metadata: input.metadata,
         },
      });
   }

   async delete(workspaceId: string, id: string): Promise<boolean> {
      const deleted = await prisma.announcement.deleteMany({
         where: { id, workspaceId },
      });

      return deleted.count > 0;
   }
}
