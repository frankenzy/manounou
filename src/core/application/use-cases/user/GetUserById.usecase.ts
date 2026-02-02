/**
 * Use Case: GetUserById
 * Récupère un utilisateur par son ID
 */

import { UserResponseDTO } from '@/core/application/dto/User.dto';
import { IUserRepository } from '@/core/application/ports/IUserRepository';

export class GetUserByIdUseCase {
   constructor(private readonly userRepository: IUserRepository) { }

   async execute(id: number): Promise<UserResponseDTO | null> {
      if (!id || id <= 0) {
         throw new Error('Invalid user ID');
      }

      const user = await this.userRepository.findById(id);
      if (!user) {
         throw new Error('User not found');
      }

      return user;
   }
}
