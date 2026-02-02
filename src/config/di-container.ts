/**
 * DI Container: Injection de dépendances
 * Centralise l'instanciation de tous les services
 * Respecte SOLID - Dependency Inversion Principle
 */

import { PostgresAnnouncementRepository } from '@/core/infrastructure/repositories/PostgresAnnouncementRepository';
import { PostgresUserRepository } from '@/core/infrastructure/repositories/PostgresUserRepository';

// Use Cases - Announcement
import {
  GetAllAnnouncementsUseCase,
  GetAnnouncementByIdUseCase,
  CreateAnnouncementUseCase,
  UpdateAnnouncementUseCase,
  DeleteAnnouncementUseCase,
  SearchAnnouncementsUseCase,
  GetAnnouncementsByUserIdUseCase,
} from '@/core/application/use-cases/announcement';

// Use Cases - User
import {
  GetAllUsersUseCase,
  GetUserByIdUseCase,
  CreateUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
} from '@/core/application/use-cases/user';

/**
 * Container pour Announcement
 */
export class AnnouncementContainer {
  private static announcementRepository: PostgresAnnouncementRepository;

  private static getAnnouncementRepository(): PostgresAnnouncementRepository {
    if (!AnnouncementContainer.announcementRepository) {
      AnnouncementContainer.announcementRepository =
        new PostgresAnnouncementRepository();
    }
    return AnnouncementContainer.announcementRepository;
  }

  static getGetAllAnnouncementsUseCase(): GetAllAnnouncementsUseCase {
    return new GetAllAnnouncementsUseCase(
      AnnouncementContainer.getAnnouncementRepository(),
    );
  }

  static getGetAnnouncementByIdUseCase(): GetAnnouncementByIdUseCase {
    return new GetAnnouncementByIdUseCase(
      AnnouncementContainer.getAnnouncementRepository(),
    );
  }

  static getCreateAnnouncementUseCase(): CreateAnnouncementUseCase {
    return new CreateAnnouncementUseCase(
      AnnouncementContainer.getAnnouncementRepository(),
    );
  }

  static getUpdateAnnouncementUseCase(): UpdateAnnouncementUseCase {
    return new UpdateAnnouncementUseCase(
      AnnouncementContainer.getAnnouncementRepository(),
    );
  }

  static getDeleteAnnouncementUseCase(): DeleteAnnouncementUseCase {
    return new DeleteAnnouncementUseCase(
      AnnouncementContainer.getAnnouncementRepository(),
    );
  }

  static getSearchAnnouncementsUseCase(): SearchAnnouncementsUseCase {
    return new SearchAnnouncementsUseCase(
      AnnouncementContainer.getAnnouncementRepository(),
    );
  }

  static getGetAnnouncementsByUserIdUseCase(): GetAnnouncementsByUserIdUseCase {
    return new GetAnnouncementsByUserIdUseCase(
      AnnouncementContainer.getAnnouncementRepository(),
    );
  }
}

/**
 * Container pour User
 */
export class UserContainer {
  private static userRepository: PostgresUserRepository;

  private static getUserRepository(): PostgresUserRepository {
    if (!UserContainer.userRepository) {
      UserContainer.userRepository = new PostgresUserRepository();
    }
    return UserContainer.userRepository;
  }

  static getGetAllUsersUseCase(): GetAllUsersUseCase {
    return new GetAllUsersUseCase(UserContainer.getUserRepository());
  }

  static getGetUserByIdUseCase(): GetUserByIdUseCase {
    return new GetUserByIdUseCase(UserContainer.getUserRepository());
  }

  static getCreateUserUseCase(): CreateUserUseCase {
    return new CreateUserUseCase(UserContainer.getUserRepository());
  }

  static getUpdateUserUseCase(): UpdateUserUseCase {
    return new UpdateUserUseCase(UserContainer.getUserRepository());
  }

  static getDeleteUserUseCase(): DeleteUserUseCase {
    return new DeleteUserUseCase(UserContainer.getUserRepository());
  }
}
