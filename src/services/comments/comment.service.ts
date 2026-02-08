import { ICreateCommentDTO, IComment as CommentEntity, IUpdateCommentDTO } from "@/models/Comment";
import { ICommentRepository } from "@/repositories/ICommentRepository";


export class CommentService {
    constructor(
        private readonly commentRepository: ICommentRepository,
    ) { }

    async create(IComment: ICreateCommentDTO): Promise<CommentEntity> {
        return await this.commentRepository.create(IComment);
    }

    async findAll(): Promise<CommentEntity[]> {
        return await this.commentRepository.findAll();
    }

    async findOne(id: number): Promise<CommentEntity> {
        const comment = await this.commentRepository.findOne(id);

        if (!comment) {
            throw new Error(`Comment with ID ${id} not found`);
        }
        return comment;
    }


    async findByPost(postId: string): Promise<CommentEntity[]> {
        return await this.commentRepository.findByPost(postId)
    }

    async findByAuthor(authorId: string): Promise<CommentEntity[]> {
        return await this.commentRepository.findByAuthor(authorId);
    }

    async update(id: number, updateCommentDto: IUpdateCommentDTO): Promise<CommentEntity> {
        const comment = await this.findOne(id);

        Object.assign(comment, updateCommentDto);

        return await this.commentRepository.update(id, updateCommentDto);
    }

    async remove(id: number): Promise<void> {
        const comment = await this.findOne(id);
        await this.commentRepository.remove(comment.id);
    }

    async softDelete(id: number): Promise<CommentEntity> {
        const comment = await this.findOne(id);
        comment.deletedAt = new Date();
        return await this.commentRepository.save(comment);
    }

    async count(): Promise<number> {
        return await this.commentRepository.count();
    }

    async countByPost(postId: string): Promise<number> {
        return await this.commentRepository.countByPost(postId);
    }
}