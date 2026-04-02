export interface IComment {
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ICommentDTO {
  create_at: string | number | Date;
  author_id: string;
  comment: string;
  id: string;
  content: string;
  userId: string;
  postId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ICreateCommentDTO {
  content: string;
  userId: string;
  postId: string;
}

export interface IUpdateCommentDTO {
  content?: string;
}
