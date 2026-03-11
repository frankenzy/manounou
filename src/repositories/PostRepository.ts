import pool from "@/lib/db";
import {
  Post,
  IPost,
  IPostDTO,
} from "./../models/Post";

export class PostRepository {

  private readonly tableName = "posts";

  async create(post: IPost): Promise<IPostDTO> {
    const result = await pool.query(
      `INSERT INTO ${this.tableName} (user_id, title, description, parent_id, location, metadata) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        post.user_id,
        post.title,
        post.description,
        post.parent_id,
        post.location,
        post.metadata ? JSON.stringify(post.metadata) : null,
      ],
    );
    return new Post(result.rows[0]).Post();
  }

  async findById(id: number): Promise<IPostDTO | null> {

    const result = await pool.query(
      `SELECT
         a.*, 
         COUNT(DISTINCT c.id) as "commentCount",
         COUNT(DISTINCT r.id) as "repostCount"
       FROM ${this.tableName} a
       LEFT JOIN comments c ON a.id = c.announce_id
       LEFT JOIN reposts r ON a.id = r.announce_id
       WHERE a.id = $1
       GROUP BY a.id`,
      [id],
    );
    if (result.rows.length === 0) {
      return null;
    }
    return new Post(result.rows[0]).Post();
  }

  async findAll(limit?: number, offset?: number): Promise<IPostDTO[]> {
    console.log("🔍 Repository: Requête SELECT avec pagination et count des commentaires...");

    let query = `
      SELECT
        a.*,
        COUNT(DISTINCT c.id) as "commentCount",
        COUNT(DISTINCT r.id) as "repostCount"
      FROM ${this.tableName} a
      LEFT JOIN comments c ON a.id = c.announce_id
      LEFT JOIN reposts r ON a.id = r.announce_id
      GROUP BY a.id
      ORDER BY a.created_at DESC, a.id DESC
    `;
    const params: (string | number)[] = [];

    if (limit !== undefined) {
      params.push(limit);
      query += ` LIMIT $${params.length}`;
    }

    if (offset !== undefined) {
      params.push(offset);
      query += ` OFFSET $${params.length}`;
    }

    const result = await pool.query(query, params);

    return result.rows.map((row) => new Post(row).Post());
  }

  async update(
    id: number,
    post: Partial<IPost>,
  ): Promise<IPostDTO | null> {
    const fields = Object.keys(post);
    const values = Object.values(post);
    const setString = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(", ");

    const result = await pool.query(
      `UPDATE ${this.tableName} SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id],
    );

    if (result.rows.length === 0) {
      return null;
    }
    return new Post(result.rows[0]).Post();
  }

  async delete(id: number): Promise<boolean> {
    await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
    return this.findAll().then(
      (posts) => !posts.some((a) => a.id === id),
    );
  }

  async findByUserId(user_id: string): Promise<IPostDTO[]> {
    const result = await pool.query(
      `SELECT
         a.*, 
         COUNT(DISTINCT c.id) as "commentCount",
         COUNT(DISTINCT r.id) as "repostCount"
       FROM ${this.tableName} a
       LEFT JOIN comments c ON a.id = c.announce_id
       LEFT JOIN reposts r ON a.id = r.announce_id
       WHERE a.user_id = $1
       GROUP BY a.id
      ORDER BY a.created_at DESC, a.id DESC`,
      [user_id],
    );
    return result.rows.map((row) => new Post(row).Post());
  }

  async findByLocation(location: string): Promise<IPostDTO[]> {
    const result = await pool.query(
      `SELECT
         a.*, 
         COUNT(DISTINCT c.id) as "commentCount",
         COUNT(DISTINCT r.id) as "repostCount"
       FROM ${this.tableName} a
       LEFT JOIN comments c ON a.id = c.announce_id
       LEFT JOIN reposts r ON a.id = r.announce_id
       WHERE a.location = $1
       GROUP BY a.id
      ORDER BY a.created_at DESC, a.id DESC`,
      [location],
    );
    return result.rows.map((row) => new Post(row).Post());
  }

  async search(query: string): Promise<IPostDTO[]> {
    const result = await pool.query(
      `SELECT
         a.*, 
         COUNT(DISTINCT c.id) as "commentCount",
         COUNT(DISTINCT r.id) as "repostCount"
       FROM ${this.tableName} a
       LEFT JOIN comments c ON a.id = c.announce_id
       LEFT JOIN reposts r ON a.id = r.announce_id
       WHERE a.title ILIKE $1 OR a.description ILIKE $1
       GROUP BY a.id
      ORDER BY a.created_at DESC, a.id DESC`,
      [`%${query}%`],
    );
    return result.rows.map((row) => new Post(row).Post());
  }
}
