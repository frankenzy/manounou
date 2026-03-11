import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
   try {
      const { email, otp } = await request.json();

      if (!email || !otp) {
         return NextResponse.json({ success: false, message: "Email et OTP requis" }, { status: 400 });
      }

      const verification = await prisma.otpVerification.findUnique({
         where: { email },
      });

      if (!verification) {
         return NextResponse.json({ success: false, message: "Aucun code trouvé pour cet email" }, { status: 404 });
      }

      if (verification.otp !== otp) {
         return NextResponse.json({ success: false, message: "Code incorrect" }, { status: 400 });
      }

      if (verification.expiresAt < new Date()) {
         return NextResponse.json({ success: false, message: "Code expiré" }, { status: 400 });
      }

      // Valid OTP
      return NextResponse.json({ success: true, message: "Code validé avec succès" }, { status: 200 });
   } catch (error) {
      console.error("verify-otp error:", error);
      return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
   }
}
