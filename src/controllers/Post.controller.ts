import { IPost } from "@/models/Post";
import { PostService } from "@/services/PostService";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseController } from "./BaseController";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type PrismaPostLikePayload = {
  authorId?: string;
  content?: string;
  metaData?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  visibility?: string;
  title?: string;
  description?: string;
  location?: string;
  user_id?: string;
  parent_id?: number | null;
};

export class PostController extends BaseController {
  constructor(private readonly postService: PostService) {
    super();
  }

  async getAllPosts(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 20;
      const posts = await this.postService.getAllPosts(page, limit);
      return posts;
    });
  }

  async createPost(req: NextApiRequest, res: NextApiResponse) {
    try {
      const payload = this.getBody(req) as PrismaPostLikePayload;
      const normalizedUserId = (payload.user_id ?? payload.authorId ?? "").trim();

      if (!UUID_REGEX.test(normalizedUserId)) {
        return this.sendValidationError(res, 'user_id must be a valid UUID');
      }

      const normalizedMetadata: Record<string, unknown> = {
        ...(payload.metadata || payload.metaData || {}),
        ...(payload.visibility ? { visibility: payload.visibility } : {}),
      };

      const postData: IPost = {
        user_id: normalizedUserId,
        title: (payload.title || "Nouvelle annonce").trim() || "Nouvelle annonce",
        description: String(payload.description ?? payload.content ?? "").trim(),
        parent_id: payload.parent_id ?? undefined,
        location: payload.location || String(normalizedMetadata.location || "Non spécifié"),
        metadata: normalizedMetadata,
        repost: "",
        repostCount: 0,
      };

      const newPost = await this.postService.createPost(postData);
      this.sendCreated(res, newPost, 'Annonce créée avec succès');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async getPostById(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const id = this.parseId(req);
      return await this.postService.getPostById(id);
    });
  }

  async updatePost(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = this.parseId(req);
      const payload = this.getBody(req) as PrismaPostLikePayload;

      const postData: Partial<IPost> = {};

      if (payload.user_id !== undefined || payload.authorId !== undefined) {
        const normalizedUserId = String(payload.user_id ?? payload.authorId ?? "").trim();
        if (!UUID_REGEX.test(normalizedUserId)) {
          return this.sendValidationError(res, 'user_id must be a valid UUID');
        }
        postData.user_id = normalizedUserId;
      }

      if (payload.title !== undefined) {
        postData.title = payload.title;
      }

      if (payload.description !== undefined || payload.content !== undefined) {
        postData.description = String(payload.description ?? payload.content ?? "");
      }

      if (payload.parent_id !== undefined) {
        postData.parent_id = payload.parent_id === null ? undefined : payload.parent_id;
      }

      if (payload.location !== undefined) {
        postData.location = payload.location;
      }

      if (payload.metadata !== undefined || payload.metaData !== undefined || payload.visibility !== undefined) {
        postData.metadata = {
          ...(payload.metadata || payload.metaData || {}),
          ...(payload.visibility ? { visibility: payload.visibility } : {}),
        };
      }

      if (Object.keys(postData).length === 0) {
        return this.sendValidationError(res, "No valid fields provided for update");
      }

      const updatedPost = await this.postService.updatePost(id, postData);

      if (!updatedPost) {
        return this.sendNotFound(res, 'Annonce non trouvée');
      }

      this.sendSuccess(res, updatedPost, 200, 'Annonce mise à jour avec succès');
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async deletePost(req: NextApiRequest, res: NextApiResponse) {
    try {
      const id = this.parseId(req);
      await this.postService.deletePost(id);
      res.status(200).json({
        success: true,
        message: 'Annonce supprimée avec succès',
      });
    } catch (error) {
      this.handleError(res, error);
    }
  }

  async searchPosts(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const query = req.query.q as string;
      return await this.postService.searchPosts(query);
    });
  }
}