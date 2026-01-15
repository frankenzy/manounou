import { IUser } from '@/models/User.model';
import { NextApiRequest, NextApiResponse } from 'next';
import { IUserService } from '../services/IUserService';
import { BaseController } from './BaseController';

export class UserController extends BaseController {
  constructor(private userService: IUserService) {
    super();
  }

  async getAllUsers(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      return await this.userService.getAllUsers();
    });
  }

  async getUserById(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const id = this.parseId(req);
      return await this.userService.getUserById(id);
    });
  }

  async createUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const userData = this.getBody(req) as IUser;
      const user = await this.userService.createUser(userData);
      this.sendCreated(res, user, 'User created successfully');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async updateUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = this.parseId(req);
      const userData = this.getBody(req) as Partial<IUser>;
      const user = await this.userService.updateUser(id, userData);
      this.sendSuccess(res, user, 200, 'User updated successfully');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteUser(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = this.parseId(req);
      await this.userService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }
}