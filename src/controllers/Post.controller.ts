import { IPost } from "@/models/Post";
import { PostService } from "@/services/PostService";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseController } from "./BaseController";

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