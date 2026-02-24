import { NextApiRequest, NextApiResponse } from "next";
import { UserRepository } from "@/repositories/UserRepository";
import { UserService } from "@/services/UserService";
import { UserController } from "@/controllers/UserController";
import { signToken } from "@/lib/jwt";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  // Capture the created user from createUser; patch res to intercept 201
  let createdUser: { id?: number; username: string; email: string } | null = null;
  const originalJson = res.json.bind(res);
  const originalStatus = res.status.bind(res);

  let capturedStatus = 200;
  const patchedRes = Object.create(res) as NextApiResponse;
  patchedRes.status = (code: number) => {
    capturedStatus = code;
    return originalStatus(code);
  };
  patchedRes.json = (data: unknown) => {
    const body = data as { success: boolean; data?: { id?: number; username: string; email: string } };
    if (body?.success && body?.data) {
      createdUser = body.data;
    }
    return originalJson(data);
  };

  await userController.createUser(req, patchedRes);

  if (capturedStatus === 201 && createdUser) {
    const token = signToken(
      createdUser.id as number,
      createdUser.email,
      createdUser.username,
    );
    const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
    res.setHeader(
      "Set-Cookie",
      `authToken=${token}; HttpOnly; Path=/; Max-Age=${24 * 3600}; SameSite=Lax${secure}`,
    );
  }
}
