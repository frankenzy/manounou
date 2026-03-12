import { type NextRequest } from "next/server";
import { fail, getJsonBody, ok } from "../shared/http";
import { type SocialServiceV1 } from "./SocialServiceV1";

export class SocialControllerV1 {
   constructor(private readonly service: SocialServiceV1) { }

   async listPosts() {
      try {
         return ok(await this.service.listPosts());
      } catch (error) {
         return fail(error);
      }
   }

   async createPost(request: NextRequest) {
      const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
      const startedAt = Date.now();

      try {
         console.info("[v1][posts.create][start]", {
            requestId,
            method: request.method,
            path: request.nextUrl.pathname,
         });

         const payload = await getJsonBody<Parameters<SocialServiceV1["createPost"]>[0]>(request);
         console.debug("[v1][posts.create][payload]", {
            requestId,
            authorId: payload?.authorId,
            hasContent: typeof payload?.content === "string" ? payload.content.trim().length > 0 : false,
            mediaCount: Array.isArray(payload?.media) ? payload.media.length : 0,
            visibility: payload?.visibility,
         });

         const createdPost = await this.service.createPost(payload, requestId);
         console.info("[v1][posts.create][success]", {
            requestId,
            postId: createdPost.id,
            durationMs: Date.now() - startedAt,
         });

         return ok(createdPost, 201);
      } catch (error) {
         console.error("[v1][posts.create][error]", {
            requestId,
            durationMs: Date.now() - startedAt,
            error,
         });
         return fail(error);
      }
   }

   async getPost(id: string) {
      try {
         return ok(await this.service.getPostById(id));
      } catch (error) {
         return fail(error);
      }
   }

   async updatePost(request: NextRequest, id: string) {
      try {
         const payload = await getJsonBody<Parameters<SocialServiceV1["updatePost"]>[1]>(request);
         return ok(await this.service.updatePost(id, payload));
      } catch (error) {
         return fail(error);
      }
   }

   async deletePost(id: string) {
      try {
         return ok(await this.service.deletePost(id));
      } catch (error) {
         return fail(error);
      }
   }

   async listComments(postId: string) {
      try {
         return ok(await this.service.listComments(postId));
      } catch (error) {
         return fail(error);
      }
   }

   async createComment(request: NextRequest, postId: string) {
      try {
         const payload = await getJsonBody<Omit<Parameters<SocialServiceV1["createComment"]>[0], "postId">>(
            request,
         );
         return ok(await this.service.createComment({ ...payload, postId }), 201);
      } catch (error) {
         return fail(error);
      }
   }

   async getLikes(postId: string) {
      try {
         return ok(await this.service.getLikes(postId));
      } catch (error) {
         return fail(error);
      }
   }

   async likePost(request: NextRequest, postId: string) {
      try {
         const payload = await getJsonBody<{ userId: string }>(request);
         return ok(await this.service.likePost(postId, payload.userId));
      } catch (error) {
         return fail(error);
      }
   }

   async unlikePost(request: NextRequest, postId: string) {
      try {
         const payload = await getJsonBody<{ userId: string }>(request);
         return ok(await this.service.unlikePost(postId, payload.userId));
      } catch (error) {
         return fail(error);
      }
   }
}
