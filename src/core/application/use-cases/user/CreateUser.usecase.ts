/**
 * Use Case: CreateUser
 * Crée un nouvel utilisateur avec hachage du password
 */

import { CreateUserDTO, UserResponseDTO } from '@/core/application/dto/User.dto';
import { UserEntity } from '@/core/domain/entities/User.entity';
import { IUserRepository } from '@/core/application/ports/IUserRepository';
import bcrypt from 'bcryptjs';

export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserDTO): Promise<UserResponseDTO> {
    // Valider le domain entity (logique métier)
    const user = new UserEntity({
      username: input.username,
      email: input.email,
      password: input.password,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    // Vérifier que l'email n'existe pas
    const existingByEmail = await this.userRepository.findByEmail(input.email);
    if (existingByEmail) {
      throw new Error('Email already exists');
    }

    // Vérifier que le username n'existe pas
    const existingByUsername = await this.userRepository.findByUsername(
      input.username,
    );
    if (existingByUsername) {
      throw new Error('Username already exists');
    }

    // Hasher le password
    const hashedPassword = await bcrypt.hash(input.password, 10);

    // Créer avec le password hashé
    const created = await this.userRepository.create({
      ...input,
      password: hashedPassword,
    });

    console.log(`✅ Use Case: User créé avec succès (ID: ${created.id})`);
    return created;
  }
}
