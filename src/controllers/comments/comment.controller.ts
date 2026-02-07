import { ICreateCommentDTO } from "@/models/Comment";
import { CommentService } from "@/services/comments/comment.service";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseController } from "../BaseController";

export class CommentController extends BaseController {
    constructor(private readonly commentService: CommentService) {
        super();
    }

    async create(req: NextApiRequest, res: NextApiResponse) {
        try {
            const comment = await this.commentService.create(req.body as ICreateCommentDTO);
           this.sendCreated(res, comment, 'Comment created successfully');
        } catch (error) {
           this.handleError(res, error);
        }
    }

    async findAll(req: NextApiRequest, res: NextApiResponse) {
        try {
            const comments = await this.commentService.findAll();
           this.sendSuccess(res, comments);
        } catch (error) {
           this.handleError(res, error);
        }
        }
    }

    