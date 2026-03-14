import { IPostDTO } from "@/models/Post";

export type FeedPost = IPostDTO & {
   feedId: string;
   feedType: "post" | "repost";
   repostText?: string;
   repostAuthorId?: string;
   feedTimestamp: number;
};

export default FeedPost;
