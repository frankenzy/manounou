import { IPost } from "@/models/Post";
import { PostService } from "@/services/PostService";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseController } from "./BaseController";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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
      const postData = this.getBody(req) as IPost;
      const normalizedUserId = (postData.user_id ?? '').trim();

      if (!UUID_REGEX.test(normalizedUserId)) {
        return this.sendValidationError(res, 'user_id must be a valid UUID');
      }

      postData.user_id = normalizedUserId;

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
      const postData = this.getBody(req) as Partial<IPost>;

      if (postData.user_id !== undefined) {
        const normalizedUserId = String(postData.user_id).trim();
        if (!UUID_REGEX.test(normalizedUserId)) {
          return this.sendValidationError(res, 'user_id must be a valid UUID');
        }
        postData.user_id = normalizedUserId;
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