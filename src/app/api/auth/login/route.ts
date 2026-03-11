import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

interface LoginBody {
   phone?: string;
   password?: string;
}

export async function POST(request: Request) {
   try {
      const body = (await request.json()) as LoginBody;
      const phone = body.phone?.trim(); // Normalize phone number by trimming whitespace
      const password = body.password;

      if (!phone || !password) {
         return NextResponse.json(
            { success: false, message: "Numéro de téléphone et mot de passe sont requis" },
            { status: 400 },
         );
      }

      const user = await prisma.user.findUnique({ where: { phone } });
      if (!user || !user.password) {
         return NextResponse.json(
            { success: false, message: "Identifiants invalides" },
            { status: 401 },
         );
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
         return NextResponse.json(
            { success: false, message: "Identifiants invalides" },
            { status: 401 },
         );
      }

      const token = signToken(user.id, user.phone);

      const response = NextResponse.json(
         {
            success: true,
            message: "Connexion réussie",
            data: {
               id: user.id,
               phone: user.phone,
               email: user.email,
               role: user.role,
            },
         },
         { status: 200 },
      );

      response.cookies.set("authToken", token, {
         httpOnly: true,
         secure: process.env.NODE_ENV === "production",
         sameSite: "lax",
         path: "/",
         maxAge: 24 * 60 * 60,
      });

      return response;
   } catch (error) {
      console.error("Login error:", error);
      return NextResponse.json(
         { success: false, message: "Erreur interne du serveur" },
         { status: 500 },
      );
   }
}
