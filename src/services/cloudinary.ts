import 'server-only';

export class CloudinaryService {
   private cloudinary: any;
   constructor() {
      this.cloudinary = require('cloudinary').v2;
      this.cloudinary.config({
         cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
         api_key: process.env.CLOUDINARY_API_KEY,
         api_secret: process.env.CLOUDINARY_API_SECRET,
         secure: true,
      });
   }

   async uploadImage(filePath: string, folder = 'uploads'): Promise<any> {
      try {
         const result = await this.cloudinary.uploader.upload(filePath, {
            folder,
            resource_type: 'auto',
         });
         return result;
      } catch (error) {
         console.error('Error uploading image to Cloudinary:', error);
         throw error;
      }
   }


   async deleteImage(publicId: string): Promise<any> {
      try {
         const result = await this.cloudinary.uploader.destroy(publicId);
         console.log('Image deleted from Cloudinary:', result);
         return result;
      } catch (error) {
         console.error('Error deleting image from Cloudinary:', error);
         throw error;
      }
   }

}


