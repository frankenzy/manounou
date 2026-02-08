import { IAnnouncement, IAnnouncementDTO } from "@/models/Annnouncements";

export interface IAnnouncementRepository {
  create(announcement: IAnnouncement): Promise<IAnnouncementDTO>;
  findById(id: number): Promise<IAnnouncementDTO | null>;
  findAll(limit?: number, offset?: number): Promise<IAnnouncementDTO[]>;
  update(id: number, announcement: Partial<IAnnouncement>): Promise<IAnnouncementDTO | null>;
  delete(id: number): Promise<boolean>;
  findByUserId(user_id: string): Promise<IAnnouncementDTO[]>;
  findByLocation(location: string): Promise<IAnnouncementDTO[]>;
  search(query: string): Promise<IAnnouncementDTO[]>;
}