/**
 * Repository: PostgresUserRepository
 * Implémentation concrète avec PostgreSQL
 */

import pool from '@/lib/db';
import { IUserRepository } from '@/core/application/ports/IUserRepository';
import {
  UserResponseDTO,
  CreateUserDTO,
  UpdateUserDTO,
} from '@/core/application/dto/User.dto';
import { UserEntity } from '@/core/domain/entities/User.entity';

export class PostgresUserRepository implements IUserRepository {
  private readonly tableName = 'users';

  async findById(id: number): Promise<UserResponseDTO | null> {
    const query = `
      SELECT id, username, email, first_name, last_name, created_at, updated_at
      FROM ${this.tableName}
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToDTO(result.rows[0]);
  }

  async findAll(): Promise<UserResponseDTO[]> {
    const query = `
      SELECT id, username, email, first_name, last_name, created_at, updated_at
      FROM ${this.tableName}
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query);

    return result.rows.map((row) => this.mapRowToDTO(row));
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const query = `
      SELECT id, username, email, password, first_name, last_name, created_at, updated_at
      FROM ${this.tableName}
      WHERE email = $1
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return null;
    }

    return new UserEntity({
      id: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      password: result.rows[0].password,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
    });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    const query = `
      SELECT id, username, email, password, first_name, last_name, created_at, updated_at
      FROM ${this.tableName}
      WHERE username = $1
    `;
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) {
      return null;
    }

    return new UserEntity({
      id: result.rows[0].id,
      username: result.rows[0].username,
      email: result.rows[0].email,
      password: result.rows[0].password,
      firstName: result.rows[0].first_name,
      lastName: result.rows[0].last_name,
      created_at: result.rows[0].created_at,
      updated_at: result.rows[0].updated_at,
    });
  }

  async create(user: CreateUserDTO): Promise<UserResponseDTO> {
    const query = `
      INSERT INTO ${this.tableName} (username, email, password, first_name, last_name)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, username, email, first_name, last_name, created_at, updated_at
    `;
    const values = [
      user.username,
      user.email,
      user.password,
      user.firstName || null,
      user.lastName || null,
    ];

    const result = await pool.query(query, values);

    return this.mapRowToDTO(result.rows[0]);
  }

  async update(
    id: number,
    user: UpdateUserDTO,
  ): Promise<UserResponseDTO | null> {
    const fields = Object.keys(user);
    if (fields.length === 0) {
      return this.findById(id);
    }

    // Map camelCase to snake_case
    const fieldMappings: Record<string, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
    };

    const setStrings = fields.map((field, index) => {
      const dbField = fieldMappings[field] || field;
      return `${dbField} = $${index + 1}`;
    });

    const query = `
      UPDATE ${this.tableName} 
      SET ${setStrings.join(', ')}, updated_at = NOW()
      WHERE id = $${fields.length + 1}
      RETURNING id, username, email, first_name, last_name, created_at, updated_at
    `;

    const values = Object.values(user);
    const result = await pool.query(query, [...values, id]);

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToDTO(result.rows[0]);
  }

  async delete(id: number): Promise<boolean> {
    const result = await pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1`,
      [id],
    );

    return result.rowCount! > 0;
  }

  private mapRowToDTO(row: any): UserResponseDTO {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
