import { PostController } from "@/controllers/Post.controller";
import { PostRepository } from "@/repositories/PostRepository";
import { PostService } from "@/services/PostService";
import { NextApiRequest, NextApiResponse } from "next";


const postRepository = new PostRepository();
const postService = new PostService(postRepository);
const postController = new PostController(postService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            return postController.getAllPosts(req, res);

        case 'POST':
            return postController.createPost(req, res);

        case 'PUT':
            return postController.searchPosts(req, res);

        default:
            res.setHeader('Allow', []);
            return res.status(405).json({
                success: false,
                message: `Method ${method} Not Allowed`,
            });
    }
}