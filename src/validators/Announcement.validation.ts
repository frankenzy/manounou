import { IAnnouncement } from "@/models/Annnouncements";
import { ValidationResult } from "./UserValidator";

export class AnnouncementValidator {
  static validateCreate(
    announcementData: Omit<IAnnouncement, "id" | "created_ad" | "updated_at">,
  ): ValidationResult {
    const errors: string[] = [];

    if (!announcementData.title || announcementData.title.trim().length === 0) {
      errors.push("Title is required");
    } else if (announcementData.title.length < 5) {
      errors.push("Title must be at least 5 characters long");
    } else if (announcementData.title.length > 100) {
      errors.push("Title must not exceed 100 characters");
    }

    if (
      !announcementData.description ||
      announcementData.description.trim().length === 0
    ) {
      errors.push("Description is required");
    } else if (announcementData.description.length < 10) {
      errors.push("Description must be at least 10 characters long");
    }

    if (
      announcementData.location === undefined ||
      announcementData.location === null
    ) {
      errors.push("Location is required");
    } else if (
      typeof announcementData.location !== "string" ||
      announcementData.location.trim().length === 0
    ) {
      errors.push("Location must be a valid string");
    }

    if (
      !announcementData.user_id ||
      announcementData.user_id.trim().length === 0
    ) {
      errors.push("User ID is required");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static validateUpdate(
    announcementData: Partial<IAnnouncement>,
  ): ValidationResult {
    const errors: string[] = [];

    if (announcementData.title !== undefined) {
      if (announcementData.title.trim().length === 0) {
        errors.push("Title cannot be empty");
      } else if (announcementData.title.length < 5) {
        errors.push("Title must be at least 5 characters long");
      } else if (announcementData.title.length > 100) {
        errors.push("Title must not exceed 100 characters");
      }
    }

    if (announcementData.description !== undefined) {
      if (announcementData.description.trim().length === 0) {
        errors.push("Description cannot be empty");
      } else if (announcementData.description.length < 10) {
        errors.push("Description must be at least 10 characters long");
      }
    }

    if (announcementData.location !== undefined) {
      if (
        typeof announcementData.location !== "string" ||
        announcementData.location.trim().length === 0
      ) {
        errors.push("Location must be a valid string");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
