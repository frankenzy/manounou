export interface StorageProvider {
   uploadFile: (file: File) => Promise<UploadResult>;
   deleteFile: (publicId: string) => Promise<void>;
}

export type UploadResult = {
   url: string;
   secure_url: string;
   public_id: string;
};

export type UploadedImageData = {
   url: string;
   secure_url: string;
   public_id: string;
};

export interface UploadImageRef {
   openFileDialog: () => void;
}