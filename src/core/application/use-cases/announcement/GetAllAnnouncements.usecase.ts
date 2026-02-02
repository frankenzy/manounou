/**
 * Use Case: GetAllAnnouncements
 * Récupère toutes les annonces
 * Responsabilité unique: Lister les annonces
 */

import { AnnouncementResponseDTO } from '@/core/application/dto/Announcement.dto';
import { IAnnouncementRepository } from '@/core/application/ports/IAnnouncementRepository';

export class GetAllAnnouncementsUseCase {
   constructor(private readonly announcementRepository: IAnnouncementRepository) { }

   async execute(): Promise<AnnouncementResponseDTO[]> {
      console.log('🔍 Use Case: GetAllAnnouncements...');
      const announcements = await this.announcementRepository.findAll();
      console.log(`✅ Use Case: ${announcements.length} annonces retournées`);
      return announcements;
   }
}
