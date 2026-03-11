import { PostController } from '@/controllers/Post.controller';
import { PostRepository } from '@/repositories/PostRepository';
import { PostService } from '@/services/PostService';
import { NextApiRequest, NextApiResponse } from 'next';


const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);
export default async function handle(req: NextApiRequest, res: NextApiResponse) {


  const method = req.method;

  switch (method) {
    case 'GET':

      return postController.getPostById(req, res);

    case 'PUT':
      return postController.updatePost(req, res);

    case 'DELETE':
      return postController.deletePost(req, res);

    default:
      res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
      return res.status(405).json({
        success: false,
        message: `Method ${method} Not Allowed`,
      });
  }
}