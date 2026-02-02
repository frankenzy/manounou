/**
 * Use Case: GetAnnouncementsByUserId
 * Récupère les annonces d'un utilisateur
 * Responsabilité unique: Lister les annonces d'un utilisateur
 */

import { AnnouncementResponseDTO } from '@/core/application/dto/Announcement.dto';
import { IAnnouncementRepository } from '@/core/application/ports/IAnnouncementRepository';

export class GetAnnouncementsByUserIdUseCase {
  constructor(private readonly announcementRepository: IAnnouncementRepository) {}

  async execute(userId: string): Promise<AnnouncementResponseDTO[]> {
    if (!userId || userId.trim().length === 0) {
      throw new Error('Invalid user ID');
    }

    const announcements = await this.announcementRepository.findByUserId(userId);
    return announcements;
  }
}
