import pool from "@/lib/db";
import { IFriendship, IFriendshipDTO, FriendshipStatus } from "@/models/Friendship.model";

interface FriendshipRow {
  id: number;
  requester_id: number;
  addressee_id: number;
  status: FriendshipStatus;
  requester_username: string;
  addressee_username: string;
  created_at: Date;
  updated_at: Date;
}

export class FriendshipRepository {
  private readonly tableName = "friendships";

  async findById(id: number): Promise<IFriendshipDTO | null> {
    const query = `
      SELECT f.*, u1.username AS requester_username, u2.username AS addressee_username
      FROM ${this.tableName} f
      JOIN users u1 ON f.requester_id = u1.id
      JOIN users u2 ON f.addressee_id = u2.id
      WHERE f.id = $1
    `;
    const result = await pool.query(query, [id]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async findByUsers(requesterId: number, addresseeId: number): Promise<IFriendshipDTO | null> {
    const query = `
      SELECT f.*, u1.username AS requester_username, u2.username AS addressee_username
      FROM ${this.tableName} f
      JOIN users u1 ON f.requester_id = u1.id
      JOIN users u2 ON f.addressee_id = u2.id
      WHERE (f.requester_id = $1 AND f.addressee_id = $2)
         OR (f.requester_id = $2 AND f.addressee_id = $1)
    `;
    const result = await pool.query(query, [requesterId, addresseeId]);
    if (result.rows.length === 0) return null;
    return this.mapRow(result.rows[0]);
  }

  async findForUser(userId: number, status?: FriendshipStatus): Promise<IFriendshipDTO[]> {
    const params: (number | string)[] = [userId, userId];
    let statusClause = "";
    if (status) {
      statusClause = "AND f.status = $3";
      params.push(status);
    }
    const query = `
      SELECT f.*, u1.username AS requester_username, u2.username AS addressee_username
      FROM ${this.tableName} f
      JOIN users u1 ON f.requester_id = u1.id
      JOIN users u2 ON f.addressee_id = u2.id
      WHERE (f.requester_id = $1 OR f.addressee_id = $2)
      ${statusClause}
      ORDER BY f.created_at DESC
    `;
    const result = await pool.query(query, params);
    return result.rows.map((row) => this.mapRow(row));
  }

  async findPendingForAddressee(addresseeId: number): Promise<IFriendshipDTO[]> {
    const query = `
      SELECT f.*, u1.username AS requester_username, u2.username AS addressee_username
      FROM ${this.tableName} f
      JOIN users u1 ON f.requester_id = u1.id
      JOIN users u2 ON f.addressee_id = u2.id
      WHERE f.addressee_id = $1 AND f.status = 'PENDING'
      ORDER BY f.created_at DESC
    `;
    const result = await pool.query(query, [addresseeId]);
    return result.rows.map((row) => this.mapRow(row));
  }

  async create(friendship: Pick<IFriendship, "requesterId" | "addresseeId">): Promise<IFriendshipDTO> {
    const query = `
      INSERT INTO ${this.tableName} (requester_id, addressee_id, status)
      VALUES ($1, $2, 'PENDING')
      RETURNING *
    `;
    const result = await pool.query(query, [friendship.requesterId, friendship.addresseeId]);
    const created = await this.findById(result.rows[0].id as number);
    return created as IFriendshipDTO;
  }

  async updateStatus(id: number, status: FriendshipStatus): Promise<IFriendshipDTO | null> {
    const query = `
      UPDATE ${this.tableName}
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, id]);
    if (result.rows.length === 0) return null;
    return this.findById(result.rows[0].id as number);
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
    const result = await pool.query(query, [id]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  private mapRow(row: FriendshipRow): IFriendshipDTO {
    return {
      id: row.id,
      requesterId: row.requester_id,
      addresseeId: row.addressee_id,
      status: row.status,
      requesterUsername: row.requester_username,
      addresseeUsername: row.addressee_username,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
