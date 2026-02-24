import { FriendshipRepository } from "@/repositories/FriendshipRepository";
import { IFriendshipDTO, FriendshipStatus } from "@/models/Friendship.model";

export class FriendshipService {
  constructor(private readonly friendshipRepository: FriendshipRepository) {}

  async sendRequest(requesterId: number, addresseeId: number): Promise<IFriendshipDTO> {
    if (requesterId === addresseeId) {
      throw new Error("Cannot send a friend request to yourself");
    }

    const existing = await this.friendshipRepository.findByUsers(requesterId, addresseeId);
    if (existing) {
      if (existing.status === "PENDING") {
        throw new Error("A friend request is already pending");
      }
      if (existing.status === "ACCEPTED") {
        throw new Error("You are already friends");
      }
    }

    return this.friendshipRepository.create({ requesterId, addresseeId });
  }

  async acceptRequest(friendshipId: number, currentUserId: number): Promise<IFriendshipDTO> {
    const friendship = await this.friendshipRepository.findById(friendshipId);
    if (!friendship) {
      throw new Error("Friend request not found");
    }
    if (friendship.addresseeId !== currentUserId) {
      throw new Error("Only the recipient can accept a friend request");
    }
    if (friendship.status !== "PENDING") {
      throw new Error("This request has already been processed");
    }
    const updated = await this.friendshipRepository.updateStatus(friendshipId, "ACCEPTED");
    return updated as IFriendshipDTO;
  }

  async rejectRequest(friendshipId: number, currentUserId: number): Promise<IFriendshipDTO> {
    const friendship = await this.friendshipRepository.findById(friendshipId);
    if (!friendship) {
      throw new Error("Friend request not found");
    }
    if (friendship.addresseeId !== currentUserId) {
      throw new Error("Only the recipient can reject a friend request");
    }
    if (friendship.status !== "PENDING") {
      throw new Error("This request has already been processed");
    }
    const updated = await this.friendshipRepository.updateStatus(friendshipId, "REJECTED");
    return updated as IFriendshipDTO;
  }

  async getPendingRequests(userId: number): Promise<IFriendshipDTO[]> {
    return this.friendshipRepository.findPendingForAddressee(userId);
  }

  async getFriends(userId: number): Promise<IFriendshipDTO[]> {
    return this.friendshipRepository.findForUser(userId, "ACCEPTED" as FriendshipStatus);
  }

  async getAllForUser(userId: number): Promise<IFriendshipDTO[]> {
    return this.friendshipRepository.findForUser(userId);
  }
}
