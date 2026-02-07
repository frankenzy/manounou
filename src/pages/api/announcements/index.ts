import { AnnouncementController } from "@/controllers/Announcement.controller";
import { AnnouncementRepository } from "@/repositories/AnnouncementRepository";
import { AnnouncementService } from "@/services/AnnouncementService";
import { NextApiRequest, NextApiResponse } from "next";


const announcementRepository = new AnnouncementRepository();
const announcementService = new AnnouncementService(announcementRepository);
const announcementController = new AnnouncementController(announcementService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            return announcementController.getAllAnnouncements(req, res);

        case 'POST':
            return announcementController.createAnnouncement(req, res);

        case 'PUT':
            return announcementController.searchAnnouncements(req, res);

        default:
            res.setHeader('Allow', []);
            return res.status(405).json({
                success: false,
                message: `Method ${method} Not Allowed`,
            });
    }
}