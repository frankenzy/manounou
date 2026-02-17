import {
   Announcement,
   CreateAnnouncementInput,
   UpdateAnnouncementInput,
} from "@/modules/announcements/domain/entities/Announcement";

export type AnnouncementQuery = {
   workspaceId: string;
   search?: string;
   page?: number;
   limit?: number;
};

export interface AnnouncementRepository {
   list(query: AnnouncementQuery): Promise<Announcement[]>;
   findById(workspaceId: string, id: string): Promise<Announcement | null>;
   create(input: CreateAnnouncementInput): Promise<Announcement>;
   update(workspaceId: string, id: string, input: UpdateAnnouncementInput): Promise<Announcement | null>;
   delete(workspaceId: string, id: string): Promise<boolean>;
}
