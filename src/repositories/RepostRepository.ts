import pool from "@/lib/db";
import { ICreateRepostDTO, IRepost } from "@/models/Repost";

export class RepostRepository {
   private readonly tableName = "reposts";

   private async ensureSchema(): Promise<void> {
      await pool.query(`
         CREATE TABLE IF NOT EXISTS reposts (
            id SERIAL PRIMARY KEY,
            announce_id TEXT NOT NULL,
            author_id TEXT NOT NULL,
            text TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
         );
      `).catch(() => { });
   }

   async create(createRepostDto: ICreateRepostDTO): Promise<IRepost> {
      await this.ensureSchema();
      const result = await pool.query(
         `INSERT INTO ${this.tableName} (announce_id, author_id, text) VALUES ($1, $2, $3) RETURNING *`,
         [String(createRepostDto.announce_id), createRepostDto.author_id, createRepostDto.text]
      );
      return result.rows[0];
   }

   async findAll(): Promise<IRepost[]> {
      await this.ensureSchema();
      const result = await pool.query(`SELECT * FROM ${this.tableName} ORDER BY created_at DESC, id DESC`);
      return result.rows;
   }

   async findOne(id: string): Promise<IRepost> {
      await this.ensureSchema();
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
      return result.rows[0];
   }

   async findByPost(postId: string): Promise<IRepost[]> {
      await this.ensureSchema();
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE announce_id = $1 ORDER BY created_at DESC, id DESC`, [String(postId)]);
      return result.rows;
   }

   async findByAuthor(authorId: string): Promise<IRepost[]> {
      await this.ensureSchema();
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE author_id = $1 ORDER BY created_at DESC, id DESC`, [authorId]);
      return result.rows;
   }

   async remove(id: string): Promise<void> {
      await this.ensureSchema();
      await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
   }


   async countReposts(announce_id: string): Promise<number> {
      await this.ensureSchema();
      const result = await pool.query(`SELECT COUNT(*) FROM ${this.tableName} WHERE announce_id = $1`, [String(announce_id)]);
      return parseInt(result.rows[0].count, 10);
   }
}