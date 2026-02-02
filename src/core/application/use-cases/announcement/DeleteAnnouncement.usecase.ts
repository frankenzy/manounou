/**
 * Use Case: DeleteAnnouncement
 * Supprime une annonce
 * Responsabilité unique: Supprimer une annonce
 */

import { IAnnouncementRepository } from '@/core/application/ports/IAnnouncementRepository';

export class DeleteAnnouncementUseCase {
   constructor(private readonly announcementRepository: IAnnouncementRepository) { }

   async execute(id: number): Promise<boolean> {
      if (!id || id <= 0) {
         throw new Error('Invalid announcement ID');
      }

      // Vérifier que l'annonce existe
      const existing = await this.announcementRepository.findById(id);
      if (!existing) {
         throw new Error('Announcement not found');
      }

      // Supprimer
      const deleted = await this.announcementRepository.delete(id);

      if (!deleted) {
         throw new Error('Failed to delete announcement');
      }

      console.log(`✅ Use Case: Announcement ${id} supprimée`);
      return true;
   }
}
