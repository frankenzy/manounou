import { type MediaType, type PostVisibility } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreatePostInput {
   authorId: string;
   content: string;
   visibility?: PostVisibility;
   media?: Array<{ url: string; type: MediaType }>;
}

export interface UpdatePostInput {
   content?: string;
   visibility?: PostVisibility;
}

export interface CreateCommentInput {
   userId: string;
   postId: string;
   content: string;
}

export class SocialRepositoryV1 {
   listPosts() {
      return prisma.post.findMany({
         orderBy: { createdAt: "desc" },
         include: {
            author: true,
            media: true,
            comments: {
               include: { user: true },
               orderBy: { createdAt: "asc" },
            },
            likes: true,
         },
      });
   }

   getPostById(id: string) {
      return prisma.post.findUnique({
         where: { id },
         include: {
            author: true,
            media: true,
            comments: {
               include: { user: true },
               orderBy: { createdAt: "asc" },
            },
            likes: true,
         },
      });
   }

   createPost(input: CreatePostInput) {
      return prisma.post.create({
         data: {
            authorId: input.authorId,
            content: input.content,
            visibility: input.visibility,
            media: input.media
               ? {
                  create: input.media,
               }
               : undefined,
         },
         include: { media: true },
      });
   }

   updatePost(id: string, input: UpdatePostInput) {
      return prisma.post.update({
         where: { id },
         data: input,
      });
   }

   deletePost(id: string) {
      return prisma.post.delete({ where: { id } });
   }

   listComments(postId: string) {
      return prisma.comment.findMany({
         where: { postId },
         include: { user: true },
         orderBy: { createdAt: "asc" },
      });
   }

   createComment(input: CreateCommentInput) {
      return prisma.comment.create({ data: input, include: { user: true } });
   }

   countLikes(postId: string) {
      return prisma.like.count({ where: { postId } });
   }

   addLike(userId: string, postId: string) {
      return prisma.like.create({ data: { userId, postId } });
   }

   removeLike(userId: string, postId: string) {
      return prisma.like.delete({
         where: {
            userId_postId: { userId, postId },
         },
      });
   }
}
