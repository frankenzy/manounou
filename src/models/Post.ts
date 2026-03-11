export interface IPost {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  location: string;
  parent_id?: number;
  created_at?: Date;
  updated_at?: Date;
  metadata?: Record<string, unknown>;
  repost: string;
  repostCount: number;
}

export interface IPostDTO {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  parent_id?: number;
  location: string;
  created_at?: Date;
  updated_at?: Date;
  metadata?: Record<string, unknown>;
  commentCount?: number;
  repost: string;
  repostCount: number;
}

export class Post implements IPost {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  parent_id?: number;
  location: string;
  created_at?: Date;
  updated_at?: Date;
  metadata?: Record<string, unknown>;
  commentCount?: number;
  repost: string;
  repostCount: number;

  constructor(data: IPost & { commentCount?: number | string }) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.metadata = data.metadata;
    this.parent_id = data.parent_id;
    this.repost = data.repost;
    this.repostCount = data.repostCount;
    this.commentCount = typeof data.commentCount === 'string' ? parseInt(data.commentCount, 10) : data.commentCount;
  }

  Post(): IPostDTO {
    return {
      id: this.id,
      user_id: this.user_id,
      title: this.title,
      description: this.description,
      parent_id: this.parent_id,
      location: this.location,
      created_at: this.created_at,
      updated_at: this.updated_at,
      metadata: this.metadata,
      commentCount: this.commentCount,
      repost: this.repost,
      repostCount: this.repostCount,
    };
  }
}
