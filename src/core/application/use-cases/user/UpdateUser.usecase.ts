/**
 * Use Case: UpdateUser
 * Met à jour un utilisateur
 */

import { UpdateUserDTO, UserResponseDTO } from '@/core/application/dto/User.dto';
import { IUserRepository } from '@/core/application/ports/IUserRepository';

export class UpdateUserUseCase {
   constructor(private readonly userRepository: IUserRepository) { }

   async execute(
      id: number,
      input: UpdateUserDTO,
   ): Promise<UserResponseDTO | null> {
      if (!id || id <= 0) {
         throw new Error('Invalid user ID');
      }

      // Vérifier que l'utilisateur existe
      const existing = await this.userRepository.findById(id);
      if (!existing) {
         throw new Error('User not found');
      }

      // Vérifier l'email s'il a changé
      if (input.email && input.email !== existing.email) {
         const userWithEmail = await this.userRepository.findByEmail(input.email);
         if (userWithEmail) {
            throw new Error('Email already exists');
         }
      }

      // Vérifier le username s'il a changé
      if (input.username && input.username !== existing.username) {
         const userWithUsername = await this.userRepository.findByUsername(
            input.username,
         );
         if (userWithUsername) {
            throw new Error('Username already exists');
         }
      }

      const updated = await this.userRepository.update(id, input);

      if (!updated) {
         throw new Error('Failed to update user');
      }

      console.log(`✅ Use Case: User ${id} mise à jour`);
      return updated;
   }
}
