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

   async createPost(input: CreatePostInput, requestId?: string) {
      try {
         const post = await prisma.post.create({
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

         console.debug("[v1][posts.create][repository][success]", {
            requestId,
            postId: post.id,
            mediaCount: post.media.length,
         });

         return post;
      } catch (error) {
         console.error("[v1][posts.create][repository][error]", {
            requestId,
            input: {
               authorId: input?.authorId,
               hasContent: typeof input?.content === "string" ? input.content.trim().length > 0 : false,
               mediaCount: Array.isArray(input?.media) ? input.media.length : 0,
               visibility: input?.visibility,
            },
            error,
         });
         throw error;
      }
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
      // Validate referenced user/post to provide clearer errors instead of FK violation
      return (async () => {
         // Try resolving user by id, phone or email to support legacy payloads
         let user = await prisma.user.findUnique({ where: { id: input.userId } });
         if (!user) {
            user = await prisma.user.findUnique({ where: { phone: input.userId } as any });
         }
         if (!user) {
            user = await prisma.user.findUnique({ where: { email: input.userId } as any });
         }
         if (!user) {
            throw new Error("User not found");
         }
         const post = await prisma.post.findUnique({ where: { id: input.postId } });
         if (!post) {
            throw new Error("Post not found");
         }
         return prisma.comment.create({ data: input, include: { user: true } });
      })();
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
