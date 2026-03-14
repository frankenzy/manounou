export interface IComment {
    id: string;
    content: string;
    userId: string;
    postId: string;
    createdAt: Date;
    updatedAt?: Date;
}

export interface ICommentDTO {
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