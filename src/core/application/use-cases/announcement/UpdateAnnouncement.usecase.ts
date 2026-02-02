/**
 * Use Case: UpdateAnnouncement
 * Met à jour une annonce
 * Responsabilité unique: Mettre à jour une annonce
 */

import {
   AnnouncementResponseDTO,
   UpdateAnnouncementDTO,
} from '@/core/application/dto/Announcement.dto';
import { IAnnouncementRepository } from '@/core/application/ports/IAnnouncementRepository';

export class UpdateAnnouncementUseCase {
   constructor(private readonly announcementRepository: IAnnouncementRepository) { }

   async execute(
      id: number,
      input: UpdateAnnouncementDTO,
   ): Promise<AnnouncementResponseDTO | null> {
      if (!id || id <= 0) {
         throw new Error('Invalid announcement ID');
      }

      // Vérifier que l'annonce existe
      const existing = await this.announcementRepository.findById(id);
      if (!existing) {
         throw new Error('Announcement not found');
      }

      // Mettre à jour
      const updated = await this.announcementRepository.update(id, input);

      if (!updated) {
         throw new Error('Failed to update announcement');
      }

      console.log(`✅ Use Case: Announcement ${id} mise à jour`);
      return updated;
   }
}
