/**
 * Port: IAnnouncementRepository
 * Interface que toute implémentation de repository doit respecter
 * Applique SOLID - Dependency Inversion Principle
 */

import { AnnouncementEntity } from '@/core/domain/entities/Announcement.entity';
import {
  AnnouncementResponseDTO,
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
} from '@/core/application/dto/Announcement.dto';

export interface IAnnouncementRepository {
  // Lecture
  findById(id: number): Promise<AnnouncementResponseDTO | null>;
  findAll(): Promise<AnnouncementResponseDTO[]>;
  findByUserId(userId: string): Promise<AnnouncementResponseDTO[]>;
  findByLocation(location: string): Promise<AnnouncementResponseDTO[]>;
  search(query: string): Promise<AnnouncementResponseDTO[]>;

  // Écriture
  create(announcement: CreateAnnouncementDTO): Promise<AnnouncementResponseDTO>;
  update(
    id: number,
    announcement: UpdateAnnouncementDTO,
  ): Promise<AnnouncementResponseDTO | null>;
  delete(id: number): Promise<boolean>;
}
