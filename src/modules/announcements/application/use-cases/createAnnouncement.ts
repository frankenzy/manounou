import { AnnouncementDTO } from "@/modules/announcements/application/dto/AnnouncementDTO";
import { toAnnouncementDTO } from "@/modules/announcements/application/mappers/announcement.mapper";
import { CreateAnnouncementInput } from "@/modules/announcements/domain/entities/Announcement";
import { AnnouncementRepository } from "@/modules/announcements/domain/repositories/AnnouncementRepository";

export class CreateAnnouncementUseCase {
   constructor(private readonly repository: AnnouncementRepository) { }

   async execute(input: CreateAnnouncementInput): Promise<AnnouncementDTO> {
      if (!input.title.trim()) {
         throw new Error("Title is required");
      }

      if (!input.description.trim()) {
         throw new Error("Description is required");
      }

      const created = await this.repository.create(input);
      return toAnnouncementDTO(created);
   }
}
