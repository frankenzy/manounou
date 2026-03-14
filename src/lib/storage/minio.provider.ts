import { StorageProvider, UploadResult } from "./storage.interface";

export class MinioProvider implements StorageProvider {
   async uploadFile(file: File): Promise<UploadResult> {
      // Implement Minio file upload logic here
      void file;
      return {
         url: '',
         secure_url: '',
         public_id: ''
      };
   }

   async deleteFile(publicId: string): Promise<void> {
      // Implement Minio file deletion logic here
      void publicId;
   }
}