import { NextApiRequest, NextApiResponse } from 'next';
import { UserController } from '../../../controllers/UserController';
import { UserRepository } from '../../../repositories/UserRepository';
import { UserService } from '../../../services/UserService';

// Dependency Injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return userController.getAllUsers(req, res);
    
    case 'POST':
      return userController.createUser(req, res);
    
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).json({
        success: false,
        message: `Method ${method} Not Allowed`,
      });
  }
}