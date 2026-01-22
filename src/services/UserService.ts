// src/services/UserService.ts
import { UserValidator } from "@/validators/UserValidator";
import bcrypt from "bcryptjs";
import { IUser, IUserDTO } from "../models/User.model";
import { IUserRepository } from "../repositories/IUserRepository";
import { IUserService } from "./IUserService";

export class UserService implements IUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async getAllUsers(): Promise<IUserDTO[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<IUserDTO> {
    if (!id || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }

  async createUser(
    userData: Omit<IUser, "id" | "created_ad" | "updated_at">,
  ): Promise<IUserDTO> {
    const validation = UserValidator.validateCreate(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const existingUserByEmail = await this.userRepository.findByEmail(
      userData.email,
    );
    if (existingUserByEmail) {
      throw new Error("Email already exists");
    }

    const existingUserByUsername = await this.userRepository.findByUsername(
      userData.username,
    );
    if (existingUserByUsername) {
      throw new Error("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const userToCreate = {
      ...userData,
      password: hashedPassword,
    };

    return await this.userRepository.create(userToCreate);
  }

  async updateUser(id: number, userData: Partial<IUser>): Promise<IUserDTO> {
    if (!id || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const validation = UserValidator.validateUpdate(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(", "));
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    if (userData.email && userData.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(
        userData.email,
      );
      if (userWithEmail) {
        throw new Error("Email already exists");
      }
    }

    if (userData.username && userData.username !== existingUser.username) {
      const userWithUsername = await this.userRepository.findByUsername(
        userData.username,
      );
      if (userWithUsername) {
        throw new Error("Username already exists");
      }
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    const updatedUser = await this.userRepository.update(id, userData);

    if (!updatedUser) {
      throw new Error("Failed to update user");
    }

    return updatedUser;
  }

  async deleteUser(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error("Invalid user ID");
    }

    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new Error("User not found");
    }

    const deleted = await this.userRepository.delete(id);

    if (!deleted) {
      throw new Error("Failed to delete user");
    }
  }
}
