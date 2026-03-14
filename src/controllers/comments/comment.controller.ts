import { IComment, ICreateCommentDTO } from "@/models/Comment";
import { CommentService } from "@/services/comments/comment.service";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseController } from "../BaseController";

export class CommentController extends BaseController {
    constructor(private readonly commentService: CommentService) {
        super();
    }

    async create(req: NextApiRequest, res: NextApiResponse) {
        try {
            const body = req.body as any;
            const payload: ICreateCommentDTO = {
                content: body.content ?? body.comment,
                userId: body.userId ?? body.author_id,
                postId: body.postId ?? body.announce_id,
            };

            const comment = await this.commentService.create(payload);
            this.sendCreated(res, comment, 'Comment created successfully');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async findAll(req: NextApiRequest, res: NextApiResponse) {
        try {
            const announceId = (req.query.announce_id as string) || (req.query.postId as string) || undefined;
            const comments = await this.commentService.findAll(announceId);
            this.sendSuccess(res, comments);
        } catch (error) {
            this.handleError(res, error);
        }
    }


    async findOne(req: NextApiRequest) {
        const id = req.query.id as string;
        if (!id) throw new Error('Invalid ID provided');
        return await this.commentService.findOne(id);
    }

    async update(req: NextApiRequest, res: NextApiResponse) {
        try {
            const id = req.query.id as string;
            if (!id) throw new Error('Invalid ID provided');
            const body = this.getBody(req) as any;
            const updateDto = { content: body.content ?? body.comment } as Partial<IComment>;
            const updatedComment = await this.commentService.update(id, updateDto as any);

            if (!updatedComment) {
                return this.sendNotFound(res, 'Annonce non trouvée');
            }

            this.sendSuccess(res, updatedComment, 200, 'Annonce mise à jour avec succès');
        } catch (error) {
            this.handleError(res, error);
        }
    }

    async delete(req: NextApiRequest, res: NextApiResponse) {
        try {
            const id = req.query.id as string;
            if (!id) throw new Error('Invalid ID provided');
            await this.commentService.remove(id);
            res.status(200).json({
                success: true,
                message: 'Annonce supprimée avec succès',
            });
        } catch (error) {
            this.handleError(res, error);
        }
    }

}

