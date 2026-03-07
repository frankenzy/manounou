import { Prisma } from "@prisma/client";
import {
   type CreateCommentInput,
   type CreatePostInput,
   SocialRepositoryV1,
   type UpdatePostInput,
} from "./SocialRepositoryV1";
import { HttpError } from "../shared/http";

export class SocialServiceV1 {
   constructor(private readonly repository: SocialRepositoryV1) { }

   listPosts() {
      return this.repository.listPosts();
   }

   async getPostById(id: string) {
      const post = await this.repository.getPostById(id);
      if (!post) {
         throw new HttpError(404, "Post not found");
      }
      return post;
   }

   async createPost(input: CreatePostInput) {
      // if (!input.authorId || !input.content) {
      //    throw new HttpError(400, "authorId and content are required");
      // }
      return this.repository.createPost(input);
   }

   async updatePost(id: string, input: UpdatePostInput) {
      await this.getPostById(id);
      return this.repository.updatePost(id, input);
   }

   async deletePost(id: string) {
      await this.getPostById(id);
      await this.repository.deletePost(id);
      return { deleted: true };
   }

   async listComments(postId: string) {
      await this.getPostById(postId);
      return this.repository.listComments(postId);
   }

   async createComment(input: CreateCommentInput) {
      if (!input.content || !input.userId || !input.postId) {
         throw new HttpError(400, "postId, userId and content are required");
      }
      return this.repository.createComment(input);
   }

   async getLikes(postId: string) {
      await this.getPostById(postId);
      const count = await this.repository.countLikes(postId);
      return { postId, count };
   }

   async likePost(postId: string, userId: string) {
      await this.getPostById(postId);
      if (!userId) {
         throw new HttpError(400, "userId is required");
      }
      try {
         await this.repository.addLike(userId, postId);
      } catch (error) {
         if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
         ) {
            throw new HttpError(409, "Post already liked by this user");
         }
         throw error;
      }
      return this.getLikes(postId);
   }

   async unlikePost(postId: string, userId: string) {
      await this.getPostById(postId);
      if (!userId) {
         throw new HttpError(400, "userId is required");
      }
      try {
         await this.repository.removeLike(userId, postId);
      } catch (error) {
         if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2025"
         ) {
            throw new HttpError(404, "Like not found");
         }
         throw error;
      }
      return this.getLikes(postId);
   }
}
