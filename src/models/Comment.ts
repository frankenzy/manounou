export interface IComment {
    id: number;
    announce_id: number;
    comment: string;
    author_id: string;
    create_at: Date;
    updated_at: Date;
    deletedAt?: Date;
}


export interface ICommentDTO {
    id: number;
    announce_id: number;
    comment: string;
    author_id: string;
    create_at: Date;
    update_at: Date;
}


export interface ICreateCommentDTO {
    announce_id: number;
    comment: string;
    author_id: string;
}


export interface IUpdateCommentDTO {
    comment?: string;
}