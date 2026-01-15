import { AnnouncementController } from '@/controllers/Announcement.controller';
import { AnnouncementRepository } from '@/repositories/AnnouncementRepository';
import { AnnouncementService } from '@/services/AnnouncementService';
import { NextApiRequest, NextApiResponse } from 'next';


const announcementRepository = new AnnouncementRepository();
const announcementService = new AnnouncementService(announcementRepository);
const announcementController = new AnnouncementController(announcementService);
export default async function handle (req: NextApiRequest, res: NextApiResponse) {
   

    const method = req.method;

    switch (method) {
        case 'GET':
          
        return announcementController.getAnnouncementById(req, res);
        
        case 'PUT':
          return announcementController.updateAnnouncement(req, res);
        
        case 'DELETE':
          return announcementController.deleteAnnouncement(req, res);

        default:
            res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
            return res.status(405).json({
                success: false,
                message: `Method ${method} Not Allowed`,
            });
    }
}