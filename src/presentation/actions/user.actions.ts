'use server';

/**
 * Server Actions: User
 * Actions serveur pour les mutations sur les utilisateurs
 */

import { CreateUserDTO, UpdateUserDTO } from '@/core/application/dto/User.dto';
import { UserContainer } from '@/config/di-container';

/**
 * Créer un utilisateur
 */
export async function createUserAction(
   input: CreateUserDTO,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
   try {
      const useCase = UserContainer.getCreateUserUseCase();
      const result = await useCase.execute(input);
      return { success: true, data: result };
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Action Error:', message);
      return { success: false, error: message };
   }
}

/**
 * Mettre à jour un utilisateur
 */
export async function updateUserAction(
   id: number,
   input: UpdateUserDTO,
): Promise<{ success: boolean; data?: unknown; error?: string }> {
   try {
      const useCase = UserContainer.getUpdateUserUseCase();
      const result = await useCase.execute(id, input);
      return { success: true, data: result };
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Action Error:', message);
      return { success: false, error: message };
   }
}

/**
 * Supprimer un utilisateur
 */
export async function deleteUserAction(
   id: number,
): Promise<{ success: boolean; error?: string }> {
   try {
      const useCase = UserContainer.getDeleteUserUseCase();
      await useCase.execute(id);
      return { success: true };
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Action Error:', message);
      return { success: false, error: message };
   }
}
