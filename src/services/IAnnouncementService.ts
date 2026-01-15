import { IAnnouncement, IAnnouncementDTO } from "@/models/Annnouncements";

export interface IAnnouncementService {
  createAnnouncement(announcement: Omit<IAnnouncement, 'id' | 'createdAt' | 'updatedAt'>): Promise<IAnnouncementDTO>;
  getAnnouncementById(id: number): Promise<IAnnouncementDTO | null>;
  getAllAnnouncements(): Promise<IAnnouncementDTO[]>;
  updateAnnouncement(id: number, announcement: Partial<IAnnouncement>): Promise<IAnnouncementDTO | null>;
  deleteAnnouncement(id: number): Promise<boolean>;
  getAnnouncementsByUserId(user_id: string): Promise<IAnnouncementDTO[]>;
  getAnnouncementsByLocation(location: number): Promise<IAnnouncementDTO[]>;
  searchAnnouncements(query: string): Promise<IAnnouncementDTO[]>;
}


