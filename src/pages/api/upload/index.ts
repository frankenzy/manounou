import {
   CreateBucketCommand,
   HeadBucketCommand,
   PutBucketPolicyCommand,
   PutObjectCommand,
} from "@aws-sdk/client-s3";
import formidable, { Fields, Files, File as FormidableFile } from "formidable";
import fs from "node:fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { s3 } from "@/lib/minio";

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
};

const ALLOWED_IMAGE_MIME_TYPES = new Set([
   "image/jpeg",
   "image/png",
   "image/webp",
   "image/gif",
   "image/avif",
]);

const ensureBucketExists = async (bucket: string) => {
   try {
      await s3.send(new HeadBucketCommand({ Bucket: bucket }));
   } catch {
      await s3.send(new CreateBucketCommand({ Bucket: bucket }));
   }
};

const ensureBucketPublicRead = async (bucket: string) => {
   const policy = {
      Version: "2012-10-17",
      Statement: [
         {
            Sid: "PublicReadForObjects",
            Effect: "Allow",
            Principal: "*",
            Action: ["s3:GetObject"],
            Resource: [`arn:aws:s3:::${bucket}/*`],
         },
      ],
   };

   await s3.send(
      new PutBucketPolicyCommand({
         Bucket: bucket,
         Policy: JSON.stringify(policy),
      })
   );
};

const getPublicUrl = (bucket: string, objectKey: string) => {
   const baseEndpoint = (process.env.MINIO_PUBLIC_URL || process.env.MINIO_ENDPOINT || "").replace(/\/$/, "");
   const normalizedObjectKey = objectKey.startsWith(`${bucket}/`)
      ? objectKey.slice(bucket.length + 1)
      : objectKey;
   const encodedKey = normalizedObjectKey.split("/").map(encodeURIComponent).join("/");
   return `${baseEndpoint}/${bucket}/${encodedKey}`;
};

const sanitizeFilename = (filename: string) => {
   const sanitized = filename
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9._-]/g, "");

   return sanitized || "file";
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
      const bucket = process.env.MINIO_BUCKET;

      if (!bucket) {
         return res.status(500).json({ error: "MINIO_BUCKET is not configured" });
      }

      await ensureBucketExists(bucket);
      await ensureBucketPublicRead(bucket);

      const safeOriginalName = sanitizeFilename(file.originalFilename || file.newFilename || "file");
      const normalizedFolder = folder.trim().replace(/^\/+|\/+$/g, "");
      const effectiveFolder =
         normalizedFolder && normalizedFolder !== bucket ? normalizedFolder : "";
      const objectKey = effectiveFolder
         ? `${effectiveFolder}/${Date.now()}-${safeOriginalName}`
         : `${Date.now()}-${safeOriginalName}`;
      const fileBuffer = await fs.readFile(uploadFilePath);

      await s3.send(
         new PutObjectCommand({
            Bucket: bucket,
            Key: objectKey,
            Body: fileBuffer,
            ContentType: fileMimeType,
         })
      );

      const objectUrl = getPublicUrl(bucket, objectKey);

      return res.status(200).json({
         url: objectUrl,
         secure_url: objectUrl,
         public_id: objectKey,
      });
   } catch {
      return res.status(500).json({
         error: "Upload failed",
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
