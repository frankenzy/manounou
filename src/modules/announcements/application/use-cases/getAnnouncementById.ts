import { AnnouncementDTO } from "@/modules/announcements/application/dto/AnnouncementDTO";
import { toAnnouncementDTO } from "@/modules/announcements/application/mappers/announcement.mapper";
import { AnnouncementRepository } from "@/modules/announcements/domain/repositories/AnnouncementRepository";

export class GetAnnouncementByIdUseCase {
   constructor(private readonly repository: AnnouncementRepository) { }

   async execute(workspaceId: string, id: string): Promise<AnnouncementDTO | null> {
      const announcement = await this.repository.findById(workspaceId, id);
      if (!announcement) {
         return null;
      }
      return toAnnouncementDTO(announcement);
   }
}
