import { RepostService } from "@/services/repost/repost.service";
import { BaseController } from "./BaseController";
import { ICreateRepostDTO, RepostCreateRequest, RepostDeleteRequest } from "@/models/Repost";
import { NextApiRequest, NextApiResponse } from "next";

export default class RepostController extends BaseController {

   constructor(private readonly repostService: RepostService) {
      super();
   }

   async create(req: NextApiRequest, res: NextApiResponse) {
      try {
         const { postId, userId, text } = req.body as RepostCreateRequest;

         if (!postId || !userId) {
            return res.status(400).json({ success: false, message: "Missing postId or userId" });
         }

         const payload: ICreateRepostDTO = {
            announce_id: String(postId),
            author_id: String(userId),
            text,
         };

         const repost = await this.repostService.createRepost(payload);
         this.sendCreated(res, repost, 'Repost created successfully');
      } catch (error) {
         this.handleError(res, error);
      }
   }

   async delete(req: NextApiRequest, res: NextApiResponse) {
      try {
         const { postId } = req.body as RepostDeleteRequest;

         if (!postId) {
            return res.status(400).json({ success: false, message: "Missing postId" });
         }

         await this.repostService.deleteRepost(String(postId));
         this.sendSuccess(res, null, 200, 'Repost deleted successfully');
      } catch (error) {
         this.handleError(res, error);
      }
   }

   async get(req: NextApiRequest, res: NextApiResponse) {
      try {
         const { postId } = req.query;
         if (postId) {
            const reposts = await this.repostService.findRepostsByPost(String(postId));
            this.sendSuccess(res, reposts, 200, 'Reposts retrieved successfully');
            return;
         }

         const reposts = await this.repostService.findAllReposts();
         this.sendSuccess(res, reposts, 200, 'Reposts retrieved successfully');
      } catch (error) {
         this.handleError(res, error);
      }
   }
}