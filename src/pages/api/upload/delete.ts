import { v2 as cloudinary } from "cloudinary";
import type { NextApiRequest, NextApiResponse } from "next";

type DeleteSuccessResponse = {
   result: string;
};

type DeleteErrorResponse = {
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

export default async function handler(
   req: NextApiRequest,
   res: NextApiResponse<DeleteSuccessResponse | DeleteErrorResponse>
) {
   if (req.method !== "DELETE") {
      res.setHeader("Allow", "DELETE");
      return res.status(405).json({ error: "Method not allowed" });
   }

   ensureCloudinaryConfig();

   try {
      const publicId = req.body?.public_id;

      if (!publicId || typeof publicId !== "string") {
         return res.status(400).json({ error: "public_id is required" });
      }

      const normalizedPublicId = publicId.trim().replace(/^uploads\//, "");

      console.log("Deleting image with public_id:", normalizedPublicId);

      if (!normalizedPublicId) {
         return res.status(400).json({ error: "public_id is required" });
      }

      const result = await cloudinary.uploader.destroy(normalizedPublicId);

      if (result.result !== "ok" && result.result !== "not found") {
         return res.status(500).json({
            error: "Delete failed",
            details: result,
         });
      }

      return res.status(200).json({ result: result.result });
   } catch (error: unknown) {
      const details = error instanceof Error ? error.message : error;
      return res.status(500).json({
         error: "Delete failed",
         details,
      });
   }
}
