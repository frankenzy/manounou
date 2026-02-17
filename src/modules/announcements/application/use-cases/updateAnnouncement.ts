import { AnnouncementDTO } from "@/modules/announcements/application/dto/AnnouncementDTO";
import { toAnnouncementDTO } from "@/modules/announcements/application/mappers/announcement.mapper";
import { UpdateAnnouncementInput } from "@/modules/announcements/domain/entities/Announcement";
import { AnnouncementRepository } from "@/modules/announcements/domain/repositories/AnnouncementRepository";

export class UpdateAnnouncementUseCase {
   constructor(private readonly repository: AnnouncementRepository) { }

   async execute(
      workspaceId: string,
      id: string,
      input: UpdateAnnouncementInput,
   ): Promise<AnnouncementDTO | null> {
      const updated = await this.repository.update(workspaceId, id, input);
      if (!updated) {
         return null;
      }
      return toAnnouncementDTO(updated);
   }
}
