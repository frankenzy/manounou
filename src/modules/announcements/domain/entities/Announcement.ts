export type AnnouncementMetadata = Record<string, unknown>;

export type Announcement = {
   id: string;
   workspaceId: string;
   authorId: string;
   title: string;
   description: string;
   location: string;
   metadata?: AnnouncementMetadata | null;
   createdAt: Date;
   updatedAt: Date;
};

export type CreateAnnouncementInput = {
   workspaceId: string;
   authorId: string;
   title: string;
   description: string;
   location: string;
   metadata?: AnnouncementMetadata;
};

export type UpdateAnnouncementInput = {
   title?: string;
   description?: string;
   location?: string;
   metadata?: AnnouncementMetadata;
};
