/**
 * Repository: PostgresAnnouncementRepository
 * Implémentation concrète avec PostgreSQL
 */

import pool from '@/lib/db';
import { IAnnouncementRepository } from '@/core/application/ports/IAnnouncementRepository';
import {
  AnnouncementResponseDTO,
  CreateAnnouncementDTO,
  UpdateAnnouncementDTO,
} from '@/core/application/dto/Announcement.dto';

export class PostgresAnnouncementRepository
  implements IAnnouncementRepository
{
  private readonly tableName = 'announcements';

  async findById(id: number): Promise<AnnouncementResponseDTO | null> {
    console.log('🔍 Repository: findById...');
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToDTO(result.rows[0]);
  }

  async findAll(): Promise<AnnouncementResponseDTO[]> {
    console.log('🔍 Repository: Requête SELECT * FROM announcements...');
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} ORDER BY created_at DESC`,
    );
    console.log(
      `✅ Repository: ${result.rows.length} lignes récupérées de la BD`,
    );

    return result.rows.map((row) => this.mapRowToDTO(row));
  }

  async findByUserId(userId: string): Promise<AnnouncementResponseDTO[]> {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );

    return result.rows.map((row) => this.mapRowToDTO(row));
  }

  async findByLocation(location: string): Promise<AnnouncementResponseDTO[]> {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE location = $1 ORDER BY created_at DESC`,
      [location],
    );

    return result.rows.map((row) => this.mapRowToDTO(row));
  }

  async search(query: string): Promise<AnnouncementResponseDTO[]> {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE title ILIKE $1 OR description ILIKE $1 ORDER BY created_at DESC`,
      [`%${query}%`],
    );

    return result.rows.map((row) => this.mapRowToDTO(row));
  }

  async create(
    announcement: CreateAnnouncementDTO,
  ): Promise<AnnouncementResponseDTO> {
    console.log('💾 Repository: Creating announcement...');
    const result = await pool.query(
      `INSERT INTO ${this.tableName} (user_id, title, description, location, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        announcement.user_id,
        announcement.title,
        announcement.description,
        announcement.location,
        announcement.metadata ? JSON.stringify(announcement.metadata) : null,
      ],
    );

    return this.mapRowToDTO(result.rows[0]);
  }

  async update(
    id: number,
    announcement: UpdateAnnouncementDTO,
  ): Promise<AnnouncementResponseDTO | null> {
    const fields = Object.keys(announcement);
    if (fields.length === 0) {
      return this.findById(id);
    }

    const values = Object.values(announcement);
    const setString = fields
      .map((field, index) => `${field} = $${index + 1}`)
      .join(', ');

    const result = await pool.query(
      `UPDATE ${this.tableName} SET ${setString}, updated_at = NOW() WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToDTO(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    console.log('🗑️ Repository: Deleting announcement...');
    const result = await pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id],
    );

    return result.rowCount! > 0;
  }

  private mapRowToDTO(row: any): AnnouncementResponseDTO {
    return {
      id: row.id,
      user_id: row.user_id,
      title: row.title,
      description: row.description,
      location: row.location,
      created_at: row.created_at,
      updated_at: row.updated_at,
      metadata: row.metadata,
    };
  }
}
