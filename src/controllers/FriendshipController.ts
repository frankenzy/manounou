import { NextApiRequest, NextApiResponse } from "next";
import { FriendshipService } from "@/services/FriendshipService";
import { BaseController } from "./BaseController";
import { verifyToken } from "@/lib/jwt";

export class FriendshipController extends BaseController {
  constructor(private friendshipService: FriendshipService) {
    super();
  }

  private getCurrentUserId(req: NextApiRequest): number {
    const token = req.cookies?.authToken;
    if (!token) throw new Error("Unauthorized");
    const payload = verifyToken(token);
    if (!payload) throw new Error("Unauthorized");
    return payload.userId;
  }

  async getPendingRequests(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const userId = this.getCurrentUserId(req);
      return this.friendshipService.getPendingRequests(userId);
    });
  }

  async getFriends(req: NextApiRequest, res: NextApiResponse) {
    await this.handleRequest(req, res, async () => {
      const userId = this.getCurrentUserId(req);
      return this.friendshipService.getFriends(userId);
    });
  }

  async sendRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
      const requesterId = this.getCurrentUserId(req);
      const { addresseeId } = this.getBody<{ addresseeId: number }>(req);
      if (!addresseeId) {
        return this.sendValidationError(res, "addresseeId is required");
      }
      const friendship = await this.friendshipService.sendRequest(requesterId, Number(addresseeId));
      this.sendCreated(res, friendship, "Friend request sent");
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      this.handleError(res, error);
    }
  }

  async respondToRequest(req: NextApiRequest, res: NextApiResponse) {
    try {
      const userId = this.getCurrentUserId(req);
      const id = this.parseId(req);
      const { action } = this.getBody<{ action: "ACCEPT" | "REJECT" }>(req);

      if (action !== "ACCEPT" && action !== "REJECT") {
        return this.sendValidationError(res, "action must be ACCEPT or REJECT");
      }

      const friendship =
        action === "ACCEPT"
          ? await this.friendshipService.acceptRequest(id, userId)
          : await this.friendshipService.rejectRequest(id, userId);

      this.sendSuccess(res, friendship, 200, `Friend request ${action === "ACCEPT" ? "accepted" : "rejected"}`);
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }
      this.handleError(res, error);
    }
  }
}
