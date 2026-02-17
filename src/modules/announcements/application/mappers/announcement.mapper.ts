import { Announcement } from "@/modules/announcements/domain/entities/Announcement";
import { AnnouncementDTO } from "@/modules/announcements/application/dto/AnnouncementDTO";

export function toAnnouncementDTO(entity: Announcement): AnnouncementDTO {
   return {
      id: entity.id,
      workspaceId: entity.workspaceId,
      authorId: entity.authorId,
      title: entity.title,
      description: entity.description,
      location: entity.location,
      metadata: entity.metadata,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
   };
}
