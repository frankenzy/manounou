import { IAnnouncement, IAnnouncementDTO } from "@/models/Announcement";
import { AnnouncementRepository } from "@/repositories/AnnouncementRepository";

export class AnnouncementService {
  private readonly announcementRepository: AnnouncementRepository;

  constructor(announcementRepository: AnnouncementRepository) {
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

  async getAllAnnouncements(page: number = 1, limit: number = 20): Promise<IAnnouncementDTO[]> {
    console.log(`🔍 Service: Appel de getAllAnnouncements (page: ${page}, limit: ${limit})...`);
    const offset = (page - 1) * limit;
    const result = await this.announcementRepository.findAll(limit, offset);
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


  async getAnnouncementImagePublicId(id: number): Promise<string | null> {
    const announcement = await this.announcementRepository.findById(id);
    if (announcement) {
      return (announcement.metadata?.imagePublicId as string | null) || null;
    }
    return null;
  }


  async getAnnouncementMetadata(id: number): Promise<Record<string, unknown> | null> {
    const announcement = await this.announcementRepository.findById(id);
    if (announcement) {
      return announcement.metadata || null;
    }
    return null;
  }

  async getAnnouncementImageUrl(id: number): Promise<string | null> {
    const announcement = await this.announcementRepository.findById(id);
    if (announcement) {
      return (announcement.metadata?.image as string | null) || null;
    }
    return null;
  }
}