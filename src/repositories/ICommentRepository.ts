import { IComment, ICreateCommentDTO, IUpdateCommentDTO } from "@/models/Comment";
import { Interface } from "readline";

export interface ICommentRepository {
    create(createCommentDto: ICreateCommentDTO): Promise<IComment>;
    findAll(): Promise<IComment[]>;
    findOne(id: number): Promise<IComment>;
    findByPost(postId: string): Promise<IComment[]>;
    findByAuthor(authorId: string): Promise<IComment[]>;
    update(id: number, updateCommentDto: IUpdateCommentDTO): Promise<IComment>;
    remove(id: number): Promise<void>;
    save(comment: IComment): Promise<IComment>;
    count(): Promise<number>;
    countByPost(postId: string): Promise<number>;

}