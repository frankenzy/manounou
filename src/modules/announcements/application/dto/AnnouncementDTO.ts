export type AnnouncementDTO = {
   id: string;
   workspaceId: string;
   authorId: string;
   title: string;
   description: string;
   location: string;
   metadata?: Record<string, unknown> | null;
   createdAt: string;
   updatedAt: string;
};
