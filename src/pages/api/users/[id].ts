import { NextApiRequest, NextApiResponse } from 'next';
import { UserController } from '../../../controllers/UserController';
import { UserRepository } from '../../../repositories/UserRepository';
import { UserService } from '../../../services/UserService';

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case 'GET':
      return userController.getUserById(req, res);
    
    case 'PUT':
      return userController.updateUser(req, res);
    
    case 'DELETE':
      return userController.deleteUser(req, res);
    
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({
        success: false,
        message: `Method ${method} Not Allowed`,
      });
  }
}