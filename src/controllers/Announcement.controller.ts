import { IAnnouncement } from "@/models/Annnouncements";
import { AnnouncementService } from "@/services/AnnouncementService";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseController } from "./BaseController";

export class AnnouncementController extends BaseController {
  constructor(private readonly announcementService: AnnouncementService) {
    super();
  }

  async getAllAnnouncements(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const announcements = await this.announcementService.getAllAnnouncements();
      return announcements;
    });
  }

  async createAnnouncement(req: NextApiRequest, res: NextApiResponse) {
    try {
      const announcementData = this.getBody(req) as IAnnouncement;
      const newAnnouncement = await this.announcementService.createAnnouncement(announcementData);
      this.sendCreated(res, newAnnouncement, 'Annonce créée avec succès');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getAnnouncementById(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const id = this.parseId(req);
      return await this.announcementService.getAnnouncementById(id);
    });
  }

  async updateAnnouncement(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = this.parseId(req);
      const announcementData = this.getBody(req) as Partial<IAnnouncement>;
      const updatedAnnouncement = await this.announcementService.updateAnnouncement(id, announcementData);
      
      if (!updatedAnnouncement) {
        return this.sendNotFound(res, 'Annonce non trouvée');
      }
      
      this.sendSuccess(res, updatedAnnouncement, 200, 'Annonce mise à jour avec succès');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deleteAnnouncement(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = this.parseId(req);
      await this.announcementService.deleteAnnouncement(id);
      res.status(200).json({
        success: true,
        message: 'Annonce supprimée avec succès',
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async searchAnnouncements(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const query = req.query.q as string;
      return await this.announcementService.searchAnnouncements(query);
    });
  }
}