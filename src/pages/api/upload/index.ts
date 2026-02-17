import { v2 as cloudinary } from "cloudinary";
import formidable, { Fields, Files, File as FormidableFile } from "formidable";
import fs from "node:fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
   api: {
      bodyParser: false,
   },
};

type UploadSuccessResponse = {
   url: string;
   secure_url: string;
   public_id: string;
   format?: string;
   resource_type?: string;
   width?: number;
   height?: number;
   bytes?: number;
   original_filename?: string;
};

type UploadErrorResponse = {
   error: string;
   details?: unknown;
};


const ensureCloudinaryConfig = () => {
   cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.KEY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY || process.env.API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET || process.env.SECRET_KEY,
      secure: true,
   });
};

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
   if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ error: "Method not allowed" });
   }

   ensureCloudinaryConfig();

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

      tempFilePath = uploadFilePath;

      const folder = normalizeField(fields.folder as string | string[] | undefined) || "uploads";

      const result = await cloudinary.uploader.upload(uploadFilePath, {
         folder,
         resource_type: "auto",
      });

      return res.status(200).json({
         url: result.secure_url,
         secure_url: result.secure_url,
         public_id: result.public_id,
         format: result.format,
         resource_type: result.resource_type,
         width: result.width,
         height: result.height,
         bytes: result.bytes,
         original_filename: result.original_filename,
      });
   } catch (error: unknown) {
      const details = error instanceof Error ? error.message : error;
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
