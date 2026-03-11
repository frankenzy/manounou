import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface RegisterBody {
   email?: string;
   password?: string;
   firstName?: string;
   lastName?: string;
   otp?: string;
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
      const otp = body.otp;

      if (!email || !password || !otp) {
         return NextResponse.json(
            { success: false, message: "Email, mot de passe et OTP sont requis" },
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

      const verification = await prisma.otpVerification.findUnique({
         where: { email },
      });

      if (!verification || verification.otp !== otp || verification.expiresAt < new Date()) {
         return NextResponse.json(
            { success: false, message: "OTP Invalide ou expiré" },
            { status: 400 }
         );
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const createData: any = {
         email,
         password: passwordHash,
      };

      if (firstName) createData.firstName = firstName;
      if (lastName) createData.lastName = lastName;

      const user = await prisma.user.create({
         data: createData,
         select: {
            id: true,
            email: true,
            password: true,
            role: true,
            createdAt: true,
         },
      });

      await prisma.otpVerification.delete({ where: { email } });

      return NextResponse.json(
         {
            success: true,
            message: "Compte créé avec succès",
            data: user,
         },
         { status: 201 },
      );
   } catch (error) {
      console.error("Register error:", error);
      return NextResponse.json(
         { success: false, message: "Erreur interne du serveur" },
         { status: 500 },
      );
   }
}
