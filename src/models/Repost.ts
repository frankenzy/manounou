import { IPostDTO } from "./Post";

export interface IRepost {
   id: number;
   announce_id: number;
   author_id: string;
   text?: string;
   created_at: Date;
   updated_at?: Date;
}

export interface ICreateRepostDTO {
   announce_id: number;
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
   announceId: string;
   authorId: string;
   text?: string;
}

export interface RepostDeleteRequest {
   announceId: string;
}