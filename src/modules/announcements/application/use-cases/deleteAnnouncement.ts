import { AnnouncementRepository } from "@/modules/announcements/domain/repositories/AnnouncementRepository";

export class DeleteAnnouncementUseCase {
   constructor(private readonly repository: AnnouncementRepository) { }

   async execute(workspaceId: string, id: string): Promise<boolean> {
      return this.repository.delete(workspaceId, id);
   }
}
