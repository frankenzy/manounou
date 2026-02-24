export interface StorageFactory {
   createProvider: (type: string) => StorageProvider;
}

import { CloudinaryProvider } from "./storage/cloudinary.provider";
import { MinioProvider } from "./storage/minio.provider";
import { StorageProvider } from "./storage/storage.interface";

export class DefaultStorageFactory implements StorageFactory {

   env = process.env.ENV_TYPE;

   createProvider(env: string): StorageProvider {

      if (env === 'local') {
         return new MinioProvider();
      } else {
         return new CloudinaryProvider();
      }
   }
}