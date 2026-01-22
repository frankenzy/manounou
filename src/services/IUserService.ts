import { IUser, IUserDTO } from "../models/User.model";

export interface IUserService {
  getAllUsers(): Promise<IUserDTO[]>;
  getUserById(id: number): Promise<IUserDTO>;
  createUser(
    userData: Omit<IUser, "id" | "created_ad" | "updated_at">,
  ): Promise<IUserDTO>;
  updateUser(id: number, userData: Partial<IUser>): Promise<IUserDTO>;
  deleteUser(id: number): Promise<void>;
}
