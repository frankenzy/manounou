export type FriendshipStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export interface IFriendship {
  id?: number;
  requesterId: number;
  addresseeId: number;
  status: FriendshipStatus;
  created_at?: Date;
  updated_at?: Date;
}

export interface IFriendshipDTO {
  id: number;
  requesterId: number;
  addresseeId: number;
  status: FriendshipStatus;
  requesterUsername?: string;
  addresseeUsername?: string;
  created_at: Date;
  updated_at: Date;
}
