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
         const { announceId, authorId, text } = req.body as RepostCreateRequest;

         if (!announceId || !authorId) {
            return res.status(400).json({ success: false, message: "Missing announceId or authorId" });
         }

         const payload: ICreateRepostDTO = {
            announce_id: Number(announceId),
            author_id: Number(authorId),
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
         const { announceId } = req.body as RepostDeleteRequest;

         if (!announceId) {
            return res.status(400).json({ success: false, message: "Missing announceId" });
         }

         await this.repostService.deleteRepost(announceId as number);
         this.sendSuccess(res, null, 200, 'Repost deleted successfully');
      } catch (error) {
         this.handleError(res, error);
      }
   }

   async get(req: NextApiRequest, res: NextApiResponse) {
      try {
         const { announceId } = req.query;
         if (announceId) {
            const reposts = await this.repostService.findRepostsByPost(String(announceId));
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