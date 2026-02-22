import formidable, { Fields, Files, File as FormidableFile } from "formidable";
import fs from "node:fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export const config = {
   api: {
      bodyParser: false,
   },
};

type UploadSuccessResponse = {
   url: string;
   secure_url: string;
   public_id: string;
};

type UploadErrorResponse = {
   error: string;
   details?: string;
};

type CloudinaryUploadResult = {
   url?: string;
   secure_url?: string;
   public_id?: string;
};

const ALLOWED_IMAGE_MIME_TYPES = new Set([
   "image/jpeg",
   "image/png",
   "image/webp",
   "image/gif",
   "image/avif",
]);

const parseForm = async (
   req: NextApiRequest
): Promise<{ fields: Fields; files: Files }> => {
   const form = formidable({
      multiples: false,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024,
   });

   return new Promise((resolve, reject) => {
      form.parse(req, (error: Error | null, fields: Fields, files: Files) => {
         if (error) {
            reject(error);
            return;
         }
         resolve({ fields, files });
      });
   });
};

const normalizeFile = (input?: FormidableFile | FormidableFile[]) => {
   if (!input) {
      return undefined;
   }
   return Array.isArray(input) ? input[0] : input;
};

const normalizeField = (input?: string | string[]) => {
   if (!input) {
      return undefined;
   }
   return Array.isArray(input) ? input[0] : input;
};

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<UploadSuccessResponse | UploadErrorResponse>
) {
   if (req.method === "OPTIONS") {
      res.setHeader("Allow", "POST, OPTIONS");
      return res.status(204).end();
   }

   if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
   }

   let tempFilePath: string | undefined;

   try {
      const { fields, files } = await parseForm(req);
      const file = normalizeFile(files.file as FormidableFile | FormidableFile[] | undefined);

      if (!file) {
         return res.status(400).json({ error: "No file provided" });
      }

      const uploadFilePath = file.filepath;
      if (!uploadFilePath) {
         return res.status(400).json({ error: "Invalid file path" });
      }

      const fileMimeType = file.mimetype || "";
      if (!ALLOWED_IMAGE_MIME_TYPES.has(fileMimeType)) {
         return res.status(400).json({ error: "Only image files are allowed" });
      }

      tempFilePath = uploadFilePath;

      const folder = normalizeField(fields.folder as string | string[] | undefined) || "uploads";
      const normalizedFolder = folder.trim().replace(/^\/+|\/+$/g, "");
      const cloudinaryResult = (await uploadImageToCloudinary(
         uploadFilePath,
         normalizedFolder || undefined,
         fileMimeType
      )) as CloudinaryUploadResult;

      const objectUrl = cloudinaryResult.secure_url || cloudinaryResult.url;
      const publicId = cloudinaryResult.public_id;

      if (!objectUrl || !publicId) {
         return res.status(500).json({ error: "Upload failed" });
      }

      return res.status(200).json({
         url: objectUrl,
         secure_url: objectUrl,
         public_id: publicId,
      });
   } catch (error) {
      const details = error instanceof Error ? error.message : "Unknown error";
      console.error("Upload API error", { details });

      return res.status(500).json({
         error: "Upload failed",
         details,
      });
   } finally {
      if (tempFilePath) {
         try {
            await fs.unlink(tempFilePath);
         } catch {
         }
      }
   }
}
