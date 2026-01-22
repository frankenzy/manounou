import { IUser } from "../models/User.model";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class UserValidator {
  static validateCreate(
    userData: Omit<IUser, "id" | "created_ad" | "updated_at">,
  ): ValidationResult {
    const errors: string[] = [];

    if (!userData.username || userData.username.trim().length === 0) {
      errors.push("Username is required");
    } else if (userData.username.length < 3) {
      errors.push("Username must be at least 3 characters long");
    } else if (userData.username.length > 50) {
      errors.push("Username must not exceed 50 characters");
    } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores",
      );
    }

    if (!userData.email || userData.email.trim().length === 0) {
      errors.push("Email is required");
    } else if (!this.isValidEmail(userData.email)) {
      errors.push("Invalid email format");
    }

    if (!userData.password || userData.password.length === 0) {
      errors.push("Password is required");
    } else if (userData.password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
      errors.push(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );
    }

    if (userData.firstName && userData.firstName.length > 100) {
      errors.push("First name must not exceed 100 characters");
    }

    if (userData.lastName && userData.lastName.length > 100) {
      errors.push("Last name must not exceed 100 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateUpdate(userData: Partial<IUser>): ValidationResult {
    const errors: string[] = [];

    if (userData.username !== undefined) {
      if (userData.username.trim().length === 0) {
        errors.push("Username cannot be empty");
      } else if (userData.username.length < 3) {
        errors.push("Username must be at least 3 characters long");
      } else if (userData.username.length > 50) {
        errors.push("Username must not exceed 50 characters");
      } else if (!/^[a-zA-Z0-9_]+$/.test(userData.username)) {
        errors.push(
          "Username can only contain letters, numbers, and underscores",
        );
      }
    }

    if (userData.email !== undefined) {
      if (userData.email.trim().length === 0) {
        errors.push("Email cannot be empty");
      } else if (!this.isValidEmail(userData.email)) {
        errors.push("Invalid email format");
      }
    }

    if (userData.password !== undefined) {
      if (userData.password.length < 8) {
        errors.push("Password must be at least 8 characters long");
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(userData.password)) {
        errors.push(
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        );
      }
    }

    if (userData.firstName !== undefined && userData.firstName.length > 100) {
      errors.push("First name must not exceed 100 characters");
    }

    if (userData.lastName !== undefined && userData.lastName.length > 100) {
      errors.push("Last name must not exceed 100 characters");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
