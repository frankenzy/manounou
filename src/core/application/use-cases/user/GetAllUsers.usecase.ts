/**
 * Use Case: GetAllUsers
 * Récupère tous les utilisateurs
 */

import { UserResponseDTO } from '@/core/application/dto/User.dto';
import { IUserRepository } from '@/core/application/ports/IUserRepository';

export class GetAllUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(): Promise<UserResponseDTO[]> {
    console.log('🔍 Use Case: GetAllUsers...');
    const users = await this.userRepository.findAll();
    console.log(`✅ Use Case: ${users.length} utilisateurs retournés`);
    return users;
  }
}
