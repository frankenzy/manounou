import pool from "@/lib/db";
import { ICreateRepostDTO, IRepost } from "@/models/Repost";

export class RepostRepository {
   private readonly tableName = "reposts";

   async create(createRepostDto: ICreateRepostDTO): Promise<IRepost> {
      const result = await pool.query(
         `INSERT INTO ${this.tableName} (announce_id, author_id, text) VALUES ($1, $2, $3) RETURNING *`,
         [createRepostDto.announce_id, createRepostDto.author_id, createRepostDto.text]
      );
      return result.rows[0];
   }

   async findAll(): Promise<IRepost[]> {
      const result = await pool.query(`SELECT * FROM ${this.tableName} ORDER BY create_at DESC, id DESC`);
      return result.rows;
   }

   async findOne(id: number): Promise<IRepost> {
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
      return result.rows[0];
   }

   async findByPost(postId: string): Promise<IRepost[]> {
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE announce_id = $1 ORDER BY create_at DESC, id DESC`, [postId]);
      return result.rows;
   }

   async findByAuthor(authorId: string): Promise<IRepost[]> {
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE author_id = $1 ORDER BY create_at DESC, id DESC`, [authorId]);
      return result.rows;
   }

   async remove(id: number): Promise<void> {
      await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
   }


   async countReposts(announce_id: number): Promise<number> {
      const result = await pool.query(`SELECT COUNT(*) FROM ${this.tableName} WHERE announce_id = $1`, [announce_id]);
      return parseInt(result.rows[0].count, 10);
   }
}