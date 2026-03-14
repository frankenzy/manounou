import { IComment, ICreateCommentDTO, IUpdateCommentDTO } from "@/models/Comment";
import { prisma } from "@/lib/prisma";

export class CommentRepository {
   async create(createCommentDto: ICreateCommentDTO): Promise<IComment> {
      const created = await prisma.comment.create({
         data: {
            content: createCommentDto.content,
            userId: createCommentDto.userId,
            postId: createCommentDto.postId,
         },
      });
      return created as unknown as IComment;
   }

   async findAll(): Promise<IComment[]> {
      const rows = await prisma.comment.findMany({ orderBy: { createdAt: "desc" } });
      return rows as unknown as IComment[];
   }

   async findOne(id: string): Promise<IComment | null> {
      const row = await prisma.comment.findUnique({ where: { id } });
      return row as unknown as IComment | null;
   }

   async findByPost(postId: string): Promise<IComment[]> {
      const rows = await prisma.comment.findMany({ where: { postId }, orderBy: { createdAt: "desc" } });
      return rows as unknown as IComment[];
   }

   async findByAuthor(authorId: string): Promise<IComment[]> {
      const rows = await prisma.comment.findMany({ where: { userId: authorId }, orderBy: { createdAt: "desc" } });
      return rows as unknown as IComment[];
   }

   async update(id: string, updateCommentDto: IUpdateCommentDTO): Promise<IComment> {
      const updated = await prisma.comment.update({ where: { id }, data: updateCommentDto });
      return updated as unknown as IComment;
   }

   async remove(id: string): Promise<void> {
      await prisma.comment.delete({ where: { id } });
   }

   async save(comment: Partial<IComment> & { id?: string }): Promise<IComment> {
      if (comment.id) {
         const { id, ...data } = comment;
         const updated = await prisma.comment.update({ where: { id }, data: data as any });
         return updated as unknown as IComment;
      } else {
         const created = await prisma.comment.create({ data: comment as any });
         return created as unknown as IComment;
      }
   }

   async count(): Promise<number> {
      const count = await prisma.comment.count();
      return count;
   }

   async countByPost(postId: string): Promise<number> {
      const count = await prisma.comment.count({ where: { postId } });
      return count;
   }
}