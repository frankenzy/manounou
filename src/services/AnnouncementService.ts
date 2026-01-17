import { IAnnouncement, IAnnouncementDTO } from "@/models/Annnouncements";
import { IAnnouncementRepository } from "@/repositories/IAnnouncementRepository";
import { IAnnouncementService } from "./IAnnouncementService";

export class AnnouncementService implements IAnnouncementService {
  private readonly announcementRepository: IAnnouncementRepository;

  constructor(announcementRepository: IAnnouncementRepository) {
    this.announcementRepository = announcementRepository;
  }
    getAnnouncementsByLocation(location: string): Promise<IAnnouncementDTO[]> {
       const result = this.announcementRepository.findAll().then(announcements =>
        announcements.filter(announcement => announcement.location === location)
      );
      return result;
    }
    searchAnnouncements(query: string): Promise<IAnnouncementDTO[]> {
      const result = this.announcementRepository.findAll().then(announcements =>
        announcements.filter(announcement =>
          announcement.title.includes(query) || announcement.description.toString().includes(query)
        )
      );
      return result;
    }

  async createAnnouncement(announcement: IAnnouncement): Promise<IAnnouncementDTO> {

    return this.announcementRepository.create(announcement);
  }

  async getAnnouncementById(id: number): Promise<IAnnouncementDTO | null> {
    return this.announcementRepository.findById(id);
  }

  async getAllAnnouncements(): Promise<IAnnouncementDTO[]> {
    console.log('🔍 Service: Appel de getAllAnnouncements...');
    const result = await this.announcementRepository.findAll();
    console.log(`✅ Service: ${result.length} annonces retournées`);
    return result;
  }

  async updateAnnouncement(id: number, announcement: Partial<IAnnouncement>): Promise<IAnnouncementDTO | null> {
    return this.announcementRepository.update(id, announcement);
  }

  async deleteAnnouncement(id: number): Promise<boolean> {
    return this.announcementRepository.delete(id);
  }

  async getAnnouncementsByUserId(user_id: string): Promise<IAnnouncementDTO[]> {
    return this.announcementRepository.findByUserId(user_id);
  }
}