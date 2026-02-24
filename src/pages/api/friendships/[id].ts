import { NextApiRequest, NextApiResponse } from "next";
import { FriendshipController } from "@/controllers/FriendshipController";
import { FriendshipRepository } from "@/repositories/FriendshipRepository";
import { FriendshipService } from "@/services/FriendshipService";

const friendshipRepository = new FriendshipRepository();
const friendshipService = new FriendshipService(friendshipRepository);
const friendshipController = new FriendshipController(friendshipService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case "PUT":
      return friendshipController.respondToRequest(req, res);
    default:
      res.setHeader("Allow", ["PUT"]);
      return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }
}
