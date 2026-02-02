/**
 * Use Case: DeleteUser
 * Supprime un utilisateur
 */

import { IUserRepository } from '@/core/application/ports/IUserRepository';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('Invalid user ID');
    }

    // Vérifier que l'utilisateur existe
    const existing = await this.userRepository.findById(id);
    if (!existing) {
      throw new Error('User not found');
    }

    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new Error('Failed to delete user');
    }

    console.log(`✅ Use Case: User ${id} supprimé`);
    return true;
  }
}
