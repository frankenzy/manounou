import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs/promises";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

const ensureCloudinaryEnv = () => {
   if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary environment variables are not fully configured");
   }
};

const signParams = (params: Record<string, string | number>) => {
   ensureCloudinaryEnv();

   const serialized = Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && `${value}`.length > 0)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([key, value]) => `${key}=${value}`)
      .join("&");

   return crypto.createHash("sha1").update(`${serialized}${apiSecret}`).digest("hex");
};

export const uploadImageToCloudinary = async (filePath: string, folder?: string) => {
   ensureCloudinaryEnv();

   const ext = path.extname(filePath).toLowerCase();
   const mimeTypeByExt: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".avif": "image/avif",
   };
   const mimeType = mimeTypeByExt[ext] || "application/octet-stream";
   const fileBuffer = await fs.readFile(filePath);
   const fileAsDataUri = `data:${mimeType};base64,${fileBuffer.toString("base64")}`;

   const timestamp = Math.floor(Date.now() / 1000);
   const paramsToSign: Record<string, string | number> = { timestamp };

   if (folder) {
      paramsToSign.folder = folder;
   }

   const signature = signParams(paramsToSign);
   const formData = new FormData();

   formData.append("file", fileAsDataUri);
   formData.append("api_key", apiKey!);
   formData.append("timestamp", String(timestamp));
   formData.append("signature", signature);

   if (folder) {
      formData.append("folder", folder);
   }

   const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
   });

   if (!response.ok) {
      throw new Error("Cloudinary upload failed");
   }

   return response.json();
};

export const destroyCloudinaryAsset = async (publicId: string) => {
   ensureCloudinaryEnv();

   const timestamp = Math.floor(Date.now() / 1000);
   const signature = signParams({ public_id: publicId, timestamp });

   const body = new URLSearchParams({
      public_id: publicId,
      api_key: apiKey!,
      timestamp: String(timestamp),
      signature,
   });

   const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`, {
      method: "POST",
      headers: {
         "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
   });

   if (!response.ok) {
      throw new Error("Cloudinary destroy failed");
   }

   return response.json();
};
