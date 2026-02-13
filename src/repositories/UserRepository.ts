import pool from "../lib/db";
import { IUser, IUserDTO } from "../models/User.model";
import { IUserRepository } from "./IUserRepository";



export interface UserRow {
  id: number;
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  updated_at: Date;
}


export class UserRepository implements IUserRepository {
  private readonly tableName = "users";

  async findAll(): Promise<IUserDTO[]> {
    try {
      const query = `
        SELECT id, username, email, first_name, last_name, created_at, updated_at
        FROM ${this.tableName}
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query);
      return result.rows.map((row) => this.mapRowToDTO(row));
    } catch (error) {
      console.error("Error in findAll:", error);
      throw new Error("Failed to fetch users");
    }
  }

  async findById(id: number): Promise<IUserDTO | null> {
    try {
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
    } catch (error) {
      console.error("Error in findById:", error);
      throw new Error("Failed to fetch user");
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      const query = `
        SELECT id, username, email, password, first_name, last_name, created_at, updated_at
        FROM ${this.tableName}
        WHERE email = $1
      `;
      const result = await pool.query(query, [email]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      console.error("Error in findByEmail:", error);
      throw new Error("Failed to fetch user by email");
    }
  }

  async findByUsername(username: string): Promise<IUser | null> {
    try {
      const query = `
        SELECT id, username, email, password, first_name, last_name, created_at, updated_at
        FROM ${this.tableName}
        WHERE username = $1
      `;
      const result = await pool.query(query, [username]);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToUser(result.rows[0]);
    } catch (error) {
      console.error("Error in findByUsername:", error);
      throw new Error("Failed to fetch user by username");
    }
  }

  async create(
    userData: Omit<IUser, "id" | "created_at" | "updated_at">,
  ): Promise<IUserDTO> {
    try {
      const query = `
        INSERT INTO ${this.tableName} (username, email, password, first_name, last_name)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, username, email, first_name, last_name, created_at, updated_at
      `;
      const values = [
        userData.username,
        userData.email,
        userData.password,
        userData.firstName || null,
        userData.lastName || null,
      ];

      const result = await pool.query(query, values);
      return this.mapRowToDTO(result.rows[0]);
    } catch (error) {
      console.error("Error in create:", error);
      throw new Error("Failed to create user");
    }
  }

  async update(id: number, userData: Partial<IUser>): Promise<IUserDTO | null> {
    try {
      const fields: string[] = [];
      const values: (string | number | boolean | undefined)[] = [];
      let paramIndex = 1;

      if (userData.username !== undefined) {
        fields.push(`username = $${paramIndex++}`);
        values.push(userData.username);
      }
      if (userData.email !== undefined) {
        fields.push(`email = $${paramIndex++}`);
        values.push(userData.email);
      }
      if (userData.password !== undefined) {
        fields.push(`password = $${paramIndex++}`);
        values.push(userData.password);
      }
      if (userData.firstName !== undefined) {
        fields.push(`first_name = $${paramIndex++}`);
        values.push(userData.firstName);
      }
      if (userData.lastName !== undefined) {
        fields.push(`last_name = $${paramIndex++}`);
        values.push(userData.lastName);
      }

      if (fields.length === 0) {
        return this.findById(id);
      }

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      values.push(id);

      const query = `
        UPDATE ${this.tableName}
        SET ${fields.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING id, username, email, first_name, last_name, created_at, updated_at
      `;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToDTO(result.rows[0]);
    } catch (error) {
      console.error("Error in update:", error);
      throw new Error("Failed to update user");
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const query = `DELETE FROM ${this.tableName} WHERE id = $1`;
      const result = await pool.query(query, [id]);
      return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
      console.error("Error in delete:", error);
      throw new Error("Failed to delete user");
    }
  }

  private mapRowToDTO(row: UserRow): IUserDTO {
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

  private mapRowToUser(row: UserRow): IUser {
    return {
      id: row.id,
      username: row.username,
      email: row.email,
      password: row.password,
      firstName: row.first_name,
      lastName: row.last_name,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }
}
