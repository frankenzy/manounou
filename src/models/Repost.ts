import { IPostDTO } from './Post';

export interface IRepost {
  id: number;
  announce_id: string; // now a string (UUID or post id)
  author_id: string;
  text?: string;
  created_at: Date;
  updated_at?: Date;
}

export interface ICreateRepostDTO {
  announce_id: string; // accept string ids (UUID)
  author_id: string;
  text?: string;
}

export interface RepostProps {
  date: Date | string | number;
  postId: string;
  alreadyReposted: boolean;
  post: IPostDTO;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export interface RepostApiResponse {
  success: boolean;
  message: string;
  alreadyReposted?: boolean;
}

export interface RepostCreateRequest {
  postId: string;
  userId: string;
  text?: string;
}

export interface RepostDeleteRequest {
  postId: string;
}
