import { IUser, IUserDTO } from '../models/User.model';

export interface IUserService {
  getAllUsers(): Promise<IUserDTO[]>;
  getUserById(id: number): Promise<IUserDTO>;
  createUser(userData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<IUserDTO>;
  updateUser(id: number, userData: Partial<IUser>): Promise<IUserDTO>;
  deleteUser(id: number): Promise<void>;
}