import { destroyCloudinaryAsset } from "@/lib/cloudinary";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== "DELETE") return res.status(405).end();

   const { public_id } = req.body;
   if (!public_id) return res.status(400).json({ error: "public_id requis" });

   try {
      await destroyCloudinaryAsset(public_id);
      return res.status(200).json({ success: true });
   } catch (error) {
      return res.status(500).json({ error: "Erreur suppression" });
   }
}
