import { IComment, ICreateCommentDTO, IUpdateCommentDTO } from "@/models/Comment";
import { ICommentRepository } from "./ICommentRepository";
import pool from "@/lib/db";

export class CommentRepository implements ICommentRepository {
   private readonly tableName = "comments";

   async create(createCommentDto: ICreateCommentDTO): Promise<IComment> {

      const result = await pool.query(
         `INSERT INTO ${this.tableName} (announce_id, author_id, comment) VALUES ($1, $2, $3) RETURNING *`,
         [createCommentDto.announce_id, createCommentDto.author_id, createCommentDto.comment]
      );
      return result.rows[0];
   }

   async findAll(): Promise<IComment[]> {
      const result = await pool.query(`SELECT * FROM ${this.tableName} ORDER BY create_at DESC`);
      return result.rows;
   }

   async findOne(id: number): Promise<IComment> {
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id]);
      return result.rows[0];
   }

   async findByPost(postId: string): Promise<IComment[]> {
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE announce_id = $1 ORDER BY create_at DESC`, [postId]);
      return result.rows;
   }

   async findByAuthor(authorId: string): Promise<IComment[]> {
      const result = await pool.query(`SELECT * FROM ${this.tableName} WHERE author_id = $1 ORDER BY create_at DESC`, [authorId]);
      return result.rows;
   }

   async update(id: number, updateCommentDto: IUpdateCommentDTO): Promise<IComment> {
      const fields = Object.keys(updateCommentDto);
      const values = Object.values(updateCommentDto);
      const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(", ");

      const result = await pool.query(
         `UPDATE ${this.tableName} SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
         [...values, id]
      );
      return result.rows[0];
   }

   async remove(id: number): Promise<void> {
      await pool.query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id]);
   }

   async save(comment: IComment): Promise<IComment> {
      if (comment.id) {
         return await this.update(comment.id, comment);
      } else {
         return await this.create({
            announce_id: comment.announce_id,
            author_id: comment.author_id,
            comment: comment.comment,
         });
      }
   }

   async count(): Promise<number> {
      const result = await pool.query(`SELECT COUNT(*) FROM ${this.tableName}`);
      return parseInt(result.rows[0].count, 10);
   }

   async countByPost(postId: string): Promise<number> {
      const result = await pool.query(`SELECT COUNT(*) FROM ${this.tableName} WHERE announce_id = $1`, [postId]);
      return parseInt(result.rows[0].count, 10);
   }
}