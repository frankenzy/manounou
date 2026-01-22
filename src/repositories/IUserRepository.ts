import { IUser, IUserDTO } from "../models/User.model";

export interface IUserRepository {
  findAll(): Promise<IUserDTO[]>;
  findById(id: number): Promise<IUserDTO | null>;
  findByEmail(email: string): Promise<IUser | null>;
  findByUsername(username: string): Promise<IUser | null>;
  create(
    user: Omit<IUser, "id" | "created_ad" | "updated_at">,
  ): Promise<IUserDTO>;
  update(id: number, user: Partial<IUser>): Promise<IUserDTO | null>;
  delete(id: number): Promise<boolean>;
}
