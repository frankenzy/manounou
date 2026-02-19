import { RepostRepository } from '@/repositories/RepostRepository';
import { NextApiRequest, NextApiResponse } from 'next';
import { RepostService } from '@/services/repost/repost.service';
import RepostController from '@/controllers/Repost.controller';



const repostRepository = new RepostRepository();
const repostService = new RepostService(repostRepository);
const repostController = new RepostController(repostService);


export default async function handler(req: NextApiRequest, res: NextApiResponse) {

   res.setHeader('Allow', ['POST']);
   if (req.method === 'POST') {
      return repostController.create(req, res);
   }

   if (req.method === 'DELETE') {
      return repostController.delete(req, res);
   }
   res.setHeader('Allow', ['DELETE']);
   // return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
   if (req.method === 'GET') {
      return repostController.get(req, res);
   }
   res.setHeader('Allow', ['GET']);
   // return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
}