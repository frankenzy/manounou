'use server';

/**
 * Server Actions: Announcement
 * Actions serveur pour les mutations sur les annonces
 * Peuvent être appelées directement depuis les Client Components
 */

import {
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
} from '@/core/application/dto/Announcement.dto';
import {
  CreateAnnouncementUseCase,
  DeleteAnnouncementUseCase,
  UpdateAnnouncementUseCase,
} from '@/core/application/use-cases/announcement';
import { AnnouncementContainer } from '@/config/di-container';

/**
 * Créer une annonce
 */
export async function createAnnouncementAction(
  input: CreateAnnouncementDTO,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const useCase = AnnouncementContainer.getCreateAnnouncementUseCase();
    const result = await useCase.execute(input);
    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Action Error:', message);
    return { success: false, error: message };
  }
}

/**
 * Mettre à jour une annonce
 */
export async function updateAnnouncementAction(
  id: number,
  input: UpdateAnnouncementDTO,
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const useCase = AnnouncementContainer.getUpdateAnnouncementUseCase();
    const result = await useCase.execute(id, input);
    return { success: true, data: result };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Action Error:', message);
    return { success: false, error: message };
  }
}

/**
 * Supprimer une annonce
 */
export async function deleteAnnouncementAction(
  id: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const useCase = AnnouncementContainer.getDeleteAnnouncementUseCase();
    await useCase.execute(id);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Action Error:', message);
    return { success: false, error: message };
  }
}
