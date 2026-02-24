import { UploadResult } from "./storage.interface";

export class CloudinaryProvider {
   async uploadFile(file: File): Promise<UploadResult> {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET || "");

      const response = await fetch(
         `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/upload`,
         {
            method: "POST",
            body: formData,
         }
      );

      if (!response.ok) {
         throw new Error(`Cloudinary upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      return {
         url: data.url,
         secure_url: data.secure_url,
         public_id: data.public_id,
      };
   }

   async deleteFile(publicId: string): Promise<void> {
      // Implement Cloudinary file deletion logic here
   }
}

type UploadSuccessResponse = {
   url: string;
   secure_url: string;
   public_id: string;
};

type UploadErrorResponse = {
   error: string;
};
