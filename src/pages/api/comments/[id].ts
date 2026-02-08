import { CommentController } from "@/controllers/comments/comment.controller";
import { CommentRepository } from "@/repositories/CommentRepository";
import { CommentService } from "@/services/comments/comment.service";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";



const commentRepository = new CommentRepository();
const commentService = new CommentService(commentRepository);
const commentController = new CommentController(commentService);

export default function handler(req: NextApiRequest, res: NextApiResponse) {

   const method = req.method;

   switch (method) {
      case 'GET':

         return commentController.findOne(req, res);

      case 'PUT':
         return commentController.update(req, res);

      case 'DELETE':
         return commentController.delete(req, res);

      default:
         res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
         return res.status(405).json({
            success: false,
            message: `Method ${method} Not Allowed`,
         });
   }
}