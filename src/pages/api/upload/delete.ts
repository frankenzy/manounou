import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import type { NextApiRequest, NextApiResponse } from "next";
import { s3 } from "@/lib/minio";

type DeleteSuccessResponse = {
   result: string;
};

type DeleteErrorResponse = {
   error: string;
};

const extractObjectKey = (publicId: string) => {
   const trimmed = publicId.trim();

   if (!trimmed) {
      return "";
   }

   if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
      try {
         const url = new URL(trimmed);
         const parts = url.pathname.split("/").filter(Boolean);
         if (parts.length >= 2) {
            return decodeURIComponent(parts.slice(1).join("/"));
         }
      } catch {
      }
   }

   return trimmed.replace(/^\/+/, "");
};

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<DeleteSuccessResponse | DeleteErrorResponse>
) {
   if (req.method === "OPTIONS") {
      res.setHeader("Allow", "DELETE, POST, OPTIONS");
      return res.status(204).end();
   }

   if (req.method !== "DELETE" && req.method !== "POST") {
      res.setHeader("Allow", "DELETE, POST");
      return res.status(405).json({ error: "Method not allowed" });
   }

   try {
      const publicId = req.body?.public_id;

      if (!publicId || typeof publicId !== "string") {
         return res.status(400).json({ error: "public_id is required" });
      }

      const objectKey = extractObjectKey(publicId);

      if (!objectKey) {
         return res.status(400).json({ error: "public_id is required" });
      }

      const bucket = process.env.MINIO_BUCKET;

      if (!bucket) {
         return res.status(500).json({ error: "MINIO_BUCKET is not configured" });
      }

      await s3.send(
         new DeleteObjectCommand({
            Bucket: bucket,
            Key: objectKey,
         })
      );

      return res.status(200).json({ result: "ok" });
   } catch {
      return res.status(500).json({
         error: "Delete failed",
      });
   }
}
