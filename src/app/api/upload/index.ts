import formidable, { Fields, Files } from "formidable";
import fs from "node:fs/promises";
import type { NextApiRequest, NextApiResponse } from "next";
import { uploadImageToCloudinary } from "@/lib/cloudinary";

export const config = {
   api: { bodyParser: false }, // Crucial pour laisser formidable gérer le flux
};

// --- Helpers de nettoyage ---
const getFirstValue = <T>(input?: T | T[]): T | undefined =>
   Array.isArray(input) ? input[0] : input;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "POST") return res.status(405).end();

   const form = formidable({ keepExtensions: true });

   let tempFilePath: string | undefined;

   try {
      const [fields, files] = await form.parse(req);

      const file = getFirstValue(files.file);
      const folder = getFirstValue(fields.folder) as string || "uploads";
      const publicId = getFirstValue(fields.public_id) as string; // Reçu si c'est une mise à jour

      if (!file?.filepath) {
         return res.status(400).json({ error: "Fichier manquant" });
      }

      tempFilePath = file.filepath;

      // Logique métier : On upload (si publicId est fourni, Cloudinary remplace l'ancien)
      const result = await uploadImageToCloudinary(
         tempFilePath,
         folder.replace(/^\/+|\/+$/g, ""),
         publicId
      );

      return res.status(200).json({
         url: result.secure_url,
         public_id: result.public_id,
      });

   } catch (error: any) {
      console.error("Upload Error:", error);
      return res.status(500).json({ error: error.message });
   } finally {
      // Bonne pratique n°1 : On ne laisse jamais de traînées sur le serveur
      if (tempFilePath) {
         await fs.unlink(tempFilePath).catch(() => null);
      }
   }
}