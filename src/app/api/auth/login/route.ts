import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

interface LoginBody {
   email?: string;
   password?: string;
}

export async function POST(request: Request) {
   try {
      const body = (await request.json()) as LoginBody;
      const email = body.email?.trim().toLowerCase();
      const password = body.password;

      if (!email || !password) {
         return NextResponse.json(
            { success: false, message: "Email et mot de passe sont requis" },
            { status: 400 },
         );
      }

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.passwordHash) {
         return NextResponse.json(
            { success: false, message: "Identifiants invalides" },
            { status: 401 },
         );
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
         return NextResponse.json(
            { success: false, message: "Identifiants invalides" },
            { status: 401 },
         );
      }

      const token = signToken(user.id, user.email);

      const response = NextResponse.json(
         {
            success: true,
            message: "Connexion réussie",
            data: {
               id: user.id,
               email: user.email,
               firstName: user.firstName,
               lastName: user.lastName,
               globalRole: user.globalRole,
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
