export interface IAnnouncement {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  location: string; // Changé de number à string pour correspondre à la BD
  created_at?: Date;
  updated_at?: Date;
  metadata?: Record<string, any>;
}

export interface IAnnouncementDTO {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  location: string; // Changé de number à string pour correspondre à la BD
  created_at?: Date;
  updated_at?: Date;
  metadata?: Record<string, any>;
  commentCount?: number;
}

export class Announcement implements IAnnouncement {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  location: string; // Changé de number à string pour correspondre à la BD
  created_at?: Date;
  updated_at?: Date;
  metadata?: Record<string, any>;
  commentCount?: number;

  constructor(data: IAnnouncement & { commentCount?: number | string }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.metadata = data.metadata;
    this.commentCount = typeof data.commentCount === 'string' ? parseInt(data.commentCount, 10) : data.commentCount;
  }

  Announcement(): IAnnouncementDTO {
    return {
      id: this.id,
      user_id: this.user_id,
      title: this.title,
      description: this.description,
      location: this.location,
      created_at: this.created_at,
      updated_at: this.updated_at,
      metadata: this.metadata,
      commentCount: this.commentCount,
    };
  }
}
