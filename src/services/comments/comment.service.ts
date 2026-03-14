import { ICreateCommentDTO, IComment as CommentEntity, IUpdateCommentDTO } from "@/models/Comment";
import { CommentRepository } from "@/repositories/CommentRepository";

export class CommentService {
    constructor(
        private readonly commentRepository: CommentRepository,
    ) { }

    async create(IComment: ICreateCommentDTO): Promise<CommentEntity> {
        return await this.commentRepository.create(IComment);
    }

    async findAll(postId?: string): Promise<CommentEntity[]> {
        if (postId) {
            return await this.commentRepository.findByPost(postId);
        }

        return await this.commentRepository.findAll();
    }

    async findOne(id: string): Promise<CommentEntity> {
        const comment = await this.commentRepository.findOne(id);

        if (!comment) {
            throw new Error(`Comment with ID ${id} not found`);
        }
        return comment as CommentEntity;
    }


    async findByPost(postId: string): Promise<CommentEntity[]> {
        return await this.commentRepository.findByPost(postId);
    }

    async findByAuthor(authorId: string): Promise<CommentEntity[]> {
        return await this.commentRepository.findByAuthor(authorId);
    }

    async update(id: string, updateCommentDto: IUpdateCommentDTO): Promise<CommentEntity> {
        const comment = await this.findOne(id);

        Object.assign(comment, updateCommentDto);

        return await this.commentRepository.update(id, updateCommentDto);
    }

    async remove(id: string): Promise<void> {
        const comment = await this.findOne(id);
        await this.commentRepository.remove(comment.id);
    }

    async softDelete(id: string): Promise<CommentEntity> {
        const comment = await this.findOne(id);
        // Prisma model doesn't have deletedAt by default; use save/update if you add soft delete
        return await this.commentRepository.save({ ...comment, id });
    }

    async count(): Promise<number> {
        return await this.commentRepository.count();
    }

    async countByPost(postId: string): Promise<number> {
        return await this.commentRepository.countByPost(postId);
    }
}