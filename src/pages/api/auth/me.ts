import { NextApiRequest, NextApiResponse } from "next";
import { UserRepository } from "@/repositories/UserRepository";
import { verifyToken } from "@/lib/jwt";

const userRepository = new UserRepository();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  const token = req.cookies?.authToken;
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const user = await userRepository.findById(payload.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("Me endpoint error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
}
