import { IComment, ICreateCommentDTO } from "@/models/Comment";
import { CommentService } from "@/services/comments/comment.service";
import { NextApiRequest, NextApiResponse } from "next";
import { BaseController } from "../BaseController";
import { updateLocale } from "moment";

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


    async findOne(req: NextApiRequest, res: NextApiResponse) {
        const id = this.parseId(req);
        return await this.commentService.findOne(id);
    }

    async update(req: NextApiRequest, res: NextApiResponse) {
        try {
            const id = this.parseId(req);
            const comment = this.getBody(req) as Partial<IComment>;
            const updatedComment = await this.commentService.update(id, comment);

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
            const id = this.parseId(req);
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

