/**
 * Port: IUserRepository
 * Interface que toute implémentation de repository doit respecter
 * Applique SOLID - Dependency Inversion Principle
 */

import { UserEntity } from '@/core/domain/entities/User.entity';
import {
   UserResponseDTO,
   CreateUserDTO,
   UpdateUserDTO,
} from '@/core/application/dto/User.dto';

export interface IUserRepository {
   // Lecture
   findById(id: number): Promise<UserResponseDTO | null>;
   findAll(): Promise<UserResponseDTO[]>;
   findByEmail(email: string): Promise<UserEntity | null>;
   findByUsername(username: string): Promise<UserEntity | null>;

   // Écriture
   create(user: CreateUserDTO): Promise<UserResponseDTO>;
   update(id: number, user: UpdateUserDTO): Promise<UserResponseDTO | null>;
   delete(id: number): Promise<boolean>;
}
