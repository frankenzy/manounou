import { NextApiRequest, NextApiResponse } from "next";
import { FriendshipController } from "@/controllers/FriendshipController";
import { FriendshipRepository } from "@/repositories/FriendshipRepository";
import { FriendshipService } from "@/services/FriendshipService";

const friendshipRepository = new FriendshipRepository();
const friendshipService = new FriendshipService(friendshipRepository);
const friendshipController = new FriendshipController(friendshipService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "GET": {
      const { type } = req.query;
      if (type === "pending") {
        return friendshipController.getPendingRequests(req, res);
      }
      return friendshipController.getFriends(req, res);
    }
    case "POST":
      return friendshipController.sendRequest(req, res);
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
