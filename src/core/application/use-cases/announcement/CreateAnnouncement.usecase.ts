/**
 * Use Case: CreateAnnouncement
 * Crée une nouvelle annonce
 * Responsabilité unique: Créer une annonce
 */

import {
  AnnouncementResponseDTO,
  CreateAnnouncementDTO,
} from '@/core/application/dto/Announcement.dto';
import { AnnouncementEntity } from '@/core/domain/entities/Announcement.entity';
import { IAnnouncementRepository } from '@/core/application/ports/IAnnouncementRepository';

export class CreateAnnouncementUseCase {
  constructor(private readonly announcementRepository: IAnnouncementRepository) {}

  async execute(input: CreateAnnouncementDTO): Promise<AnnouncementResponseDTO> {
    // Valider le domain entity (logique métier)
    const announcement = new AnnouncementEntity({
      user_id: input.user_id,
      title: input.title,
      description: input.description,
      location: input.location,
      metadata: input.metadata,
    });

    // Persister via le repository
    const created = await this.announcementRepository.create(input);

    console.log(`✅ Use Case: Announcement créée avec succès (ID: ${created.id})`);
    return created;
  }
}
