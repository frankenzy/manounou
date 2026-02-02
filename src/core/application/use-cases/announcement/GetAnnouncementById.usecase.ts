/**
 * Use Case: GetAnnouncementById
 * Récupère une annonce par son ID
 * Responsabilité unique: Lire une annonce
 */

import { AnnouncementResponseDTO } from '@/core/application/dto/Announcement.dto';
import { IAnnouncementRepository } from '@/core/application/ports/IAnnouncementRepository';

export class GetAnnouncementByIdUseCase {
   constructor(private readonly announcementRepository: IAnnouncementRepository) { }

   async execute(id: number): Promise<AnnouncementResponseDTO | null> {
      if (!id || id <= 0) {
         throw new Error('Invalid announcement ID');
      }

      const announcement = await this.announcementRepository.findById(id);
      if (!announcement) {
         throw new Error('Announcement not found');
      }

      return announcement;
   }
}
