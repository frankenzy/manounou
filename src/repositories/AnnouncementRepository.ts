import pool from '@/lib/db';
import { Announcement, IAnnouncement, IAnnouncementDTO } from './../models/Annnouncements';
import { IAnnouncementRepository } from './IAnnouncementRepository';
export class AnnouncementRepository implements IAnnouncementRepository {
  private readonly tableName = 'announcements';

  async create(announcement: IAnnouncement): Promise<IAnnouncementDTO> {
    const result = await pool.query(
      `INSERT INTO ${this.tableName} (user_id, title, description, location) VALUES ($1, $2, $3, $4) RETURNING *`,
      [announcement.user_id, announcement.title, announcement.description, announcement.location]
    );
    return new Announcement(result.rows[0]).Announcement();
  }

  async findById(id: number): Promise<IAnnouncementDTO | null> {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return new Announcement(result.rows[0]).Announcement();
  }

  async findAll(): Promise<IAnnouncementDTO[]> {
    console.log('🔍 Repository: Requête SELECT * FROM announcements...');
    const result = await pool.query(`SELECT * FROM ${this.tableName}`);
    console.log(`✅ Repository: ${result.rows.length} lignes récupérées de la BD`);
    console.log('📦 Données brutes:', JSON.stringify(result.rows, null, 2));
    return result.rows.map(row => new Announcement(row).Announcement());
  }

  async update(id: number, announcement: Partial<IAnnouncement>): Promise<IAnnouncementDTO | null> {
    const fields = Object.keys(announcement);
    const values = Object.values(announcement);
    const setString = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    const result = await pool.query(
      `UPDATE ${this.tableName} SET ${setString} WHERE id = $${fields.length + 1} RETURNING *`,
      [...values, id]
    );

    if (result.rows.length === 0) {
      return null;
    }
    return new Announcement(result.rows[0]).Announcement();
  }

  async delete(id: number): Promise<boolean> {
     await pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return this.findAll().then(announcements => !announcements.some(a => a.id === id));
  }

  async findByUserId(user_id: string): Promise<IAnnouncementDTO[]> {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE user_id = $1`,
      [user_id]
    );
    return result.rows.map(row => new Announcement(row).Announcement());
  }

  async findByLocation(location: number): Promise<IAnnouncementDTO[]> {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE location = $1`,
      [location]
    );
    return result.rows.map(row => new Announcement(row).Announcement());
  }

  async search(query: string): Promise<IAnnouncementDTO[]> {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE title ILIKE $1 OR description ILIKE $1`,
      [`%${query}%`]
    );
    return result.rows.map(row => new Announcement(row).Announcement());
  }
}
