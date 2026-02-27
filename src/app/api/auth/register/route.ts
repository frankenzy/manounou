import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

interface RegisterBody {
   email?: string;
   password?: string;
   firstName?: string;
   lastName?: string;
}

function isValidEmail(email: string): boolean {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
   return emailRegex.test(email);
}

export async function POST(request: Request) {
   try {
      const body = (await request.json()) as RegisterBody;
      const email = body.email?.trim().toLowerCase();
      const password = body.password;
      const firstName = body.firstName?.trim() || null;
      const lastName = body.lastName?.trim() || null;

      if (!email || !password) {
         return NextResponse.json(
            { success: false, message: "Email et mot de passe sont requis" },
            { status: 400 },
         );
      }

      if (!isValidEmail(email)) {
         return NextResponse.json(
            { success: false, message: "Adresse email invalide" },
            { status: 400 },
         );
      }

      if (password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
         return NextResponse.json(
            {
               success: false,
               message:
                  "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre",
            },
            { status: 400 },
         );
      }

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
         return NextResponse.json(
            { success: false, message: "Un compte existe déjà avec cet email" },
            { status: 409 },
         );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
         data: {
            email,
            passwordHash,
            firstName,
            lastName,
         },
         select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            globalRole: true,
            createdAt: true,
         },
      });

      const token = signToken(user.id, user.email);
      const response = NextResponse.json(
         {
            success: true,
            message: "Compte créé avec succès",
            data: user,
         },
         { status: 201 },
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
      console.error("Register error:", error);
      return NextResponse.json(
         { success: false, message: "Erreur interne du serveur" },
         { status: 500 },
      );
   }
}
