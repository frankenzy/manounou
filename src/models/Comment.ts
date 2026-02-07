export interface IComment {
    id: string;
    announce_id: string;
    content: string;
    authorId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
        deletedAt?: Date;
}


export interface ICommentDTO {
    id: string;
    announce_id: string;
    content: string;
    authorId: string;
    postId: string;
    createdAt: Date;
    updatedAt: Date;
}


export interface ICreateCommentDTO {
    announce_id: string;
    content: string;
    authorId: string;
    postId: string;
}


export interface IUpdateCommentDTO {
    content?: string;
}