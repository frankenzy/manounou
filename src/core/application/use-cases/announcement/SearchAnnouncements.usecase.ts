/**
 * Use Case: SearchAnnouncements
 * Cherche des annonces par query
 * Responsabilité unique: Chercher des annonces
 */

import { AnnouncementResponseDTO } from '@/core/application/dto/Announcement.dto';
import { IAnnouncementRepository } from '@/core/application/ports/IAnnouncementRepository';

export class SearchAnnouncementsUseCase {
  constructor(private readonly announcementRepository: IAnnouncementRepository) {}

  async execute(query: string): Promise<AnnouncementResponseDTO[]> {
    if (!query || query.trim().length === 0) {
      throw new Error('Search query cannot be empty');
    }

    const results = await this.announcementRepository.search(query);
    console.log(
      `✅ Use Case: ${results.length} annonces trouvées pour "${query}"`,
    );
    return results;
  }
}
