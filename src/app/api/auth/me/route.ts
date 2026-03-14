import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
   const token = request.cookies.get("authToken")?.value;
   if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
   }

   const payload = verifyToken(token);
   if (!payload) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
   }

   try {
      const user = await prisma.user.findUnique({
         where: { id: payload.userId },
         select: {
            id: true,
            phone: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
         },
      });

      if (!user) {
         return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: user }, { status: 200 });
   } catch (error) {
      console.error("Me endpoint error:", error);
      return NextResponse.json(
         { success: false, message: "Erreur interne du serveur" },
         { status: 500 },
      );
   }
}
