import {
   AnnouncementQuery,
   AnnouncementRepository,
} from "@/modules/announcements/domain/repositories/AnnouncementRepository";
import { AnnouncementDTO } from "@/modules/announcements/application/dto/AnnouncementDTO";
import { toAnnouncementDTO } from "@/modules/announcements/application/mappers/announcement.mapper";

export class ListAnnouncementsUseCase {
   constructor(private readonly repository: AnnouncementRepository) { }

   async execute(query: AnnouncementQuery): Promise<AnnouncementDTO[]> {
      const entities = await this.repository.list(query);
      return entities.map(toAnnouncementDTO);
   }
}
