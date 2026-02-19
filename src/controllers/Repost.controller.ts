import { RepostService } from "@/services/repost/repost.service";
import { BaseController } from "./BaseController";
import { ICreateRepostDTO, RepostCreateRequest, RepostDeleteRequest } from "@/models/Repost";

export default class RepostController extends BaseController {

   constructor(private readonly repostService: RepostService) {
      super();
   }

   async create(req: any, res: any) {
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

   async delete(req: any, res: any) {
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

   async get(req: any, res: any) {
      try {
         const { announceId } = req.query;

         if (!announceId) {
            return res.status(400).json({ success: false, message: "Missing announceId" });
         }
         const reposts = await this.repostService.findAllReposts();
         this.sendSuccess(res, reposts, 200, 'Reposts retrieved successfully');
      } catch (error) {
         this.handleError(res, error);
      }
   }
}