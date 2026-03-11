export interface ValidationResult {
   isValid: boolean;
   errors: string[];
}

export type UploadedImageData = {
   url: string;
   secure_url: string;
   public_id: string;
};

export type UploadResult = {
   url: string;
   secure_url: string;
   public_id: string;
};

export type CloudinaryUploadResult = {
   url?: string;
   secure_url?: string;
   public_id?: string;
};

export type UploadSuccessResponse = {
   url: string;
   secure_url: string;
   public_id: string;
};

export type UploadErrorResponse = {
   error: string;
   details?: string;
};

export interface ValidationResult {
   isValid: boolean;
   errors: string[];
}

export class PostValidator {
   static validate(
      title: string,
      content: string,
      image?: UploadedImageData
   ): ValidationResult {
      const errors: string[] = [];

      if (!this.validateTitle(title)) {
         errors.push("Title is required");
      }

      if (!this.validateContent(content)) {
         errors.push("Content is required");
      }

      if (!this.validateImage(image)) {
         errors.push("Invalid image data");
      }

      return {
         isValid: errors.length === 0,
         errors,
      };
   }

   private static validateTitle(title: string): boolean {
      return title.trim().length > 0;
   }

   private static validateContent(content: string): boolean {
      return content.trim().length > 0;
   }

   private static validateImage(image?: UploadedImageData): boolean {
      if (!image) return true; // Image is optional
      return image.url.trim().length > 0 && image.public_id.trim().length > 0;
   }
}