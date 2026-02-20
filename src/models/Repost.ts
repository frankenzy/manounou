import { IAnnouncementDTO } from "./Announcement";

export interface IRepost {
   id: number;
   announce_id: number;
   author_id: number;
   text?: string;
   create_at: Date;
   created_at?: Date;
}

export interface ICreateRepostDTO {
   announce_id: number;
   author_id: number;
   text?: string;
}

export interface RepostProps {
   date: Date | string | number;
   announceId: number | string;
   alreadyReposted: boolean;
   annonce: IAnnouncementDTO;
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
   announceId: number | string;
   authorId: number | string;
   text?: string;
}

export interface RepostDeleteRequest {
   announceId: number | string;
}