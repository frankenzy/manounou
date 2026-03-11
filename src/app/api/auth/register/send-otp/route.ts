import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const maskEmail = (email: string) => {
   const [localPart, domain] = email.split("@");
   if (!localPart || !domain) return "invalid-email";
   if (localPart.length <= 2) return `**@${domain}`;
   return `${localPart.slice(0, 2)}***@${domain}`;
};

const normalizeError = (error: unknown) => {
   if (error instanceof Error) {
      return {
         name: error.name,
         message: error.message,
         stack: error.stack,
      };
   }

   return {
      message: String(error),
   };
};

export async function POST(request: Request) {
   const requestId = `otp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

   try {
      console.log(`[send-otp][${requestId}] Request received`);
      const { email } = await request.json();
      console.log(`[send-otp][${requestId}] Payload parsed`, {
         email: typeof email === "string" ? maskEmail(email) : "missing",
      });

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
         console.warn(`[send-otp][${requestId}] Invalid email payload`);
         return NextResponse.json({ success: false, message: "Email invalide" }, { status: 400 });
      }

      console.log(`[send-otp][${requestId}] Checking existing user`);
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
         console.warn(`[send-otp][${requestId}] Email already registered`, {
            email: maskEmail(email),
         });
         return NextResponse.json(
            { success: false, message: "Un compte avec cet email existe déjà" },
            { status: 409 }
         );
      }

      const otp = otpGenerator.generate(5, {
         upperCaseAlphabets: false,
         specialChars: false,
         lowerCaseAlphabets: false,
         digits: true,
      });
      console.log(`[send-otp][${requestId}] OTP generated`, {
         otpLength: otp.length,
      });

      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      console.log(`[send-otp][${requestId}] Saving OTP in database`);
      await prisma.otpVerification.upsert({
         where: { email },
         update: { otp, expiresAt },
         create: { email, otp, expiresAt },
      });
      console.log(`[send-otp][${requestId}] OTP saved in database`);

      const smtpHost = process.env.EMAIL_HOST || "smtp.gmail.com";
      const smtpPort = Number(process.env.EMAIL_PORT) || 587;
      const smtpUser = process.env.EMAIL_USER;
      const smtpPassword = process.env.EMAIL_PASSWORD;
      const smtpSecure = smtpPort === 465;

      console.log(`[send-otp][${requestId}] SMTP config snapshot`, {
         host: smtpHost,
         port: smtpPort,
         secure: smtpSecure,
         hasUser: Boolean(smtpUser),
         hasPassword: Boolean(smtpPassword),
      });

      const transporter = nodemailer.createTransport({
         host: smtpHost,
         port: smtpPort,
         secure: smtpSecure,
         auth: {
            user: smtpUser || "test@test.com",
            pass: smtpPassword || "password",
         },
      });

      if (smtpUser && smtpPassword) {
         try {
            console.log(`[send-otp][${requestId}] Verifying SMTP connection`);
            await transporter.verify();
            console.log(`[send-otp][${requestId}] SMTP verification succeeded`);

            console.log(`[send-otp][${requestId}] Sending OTP email`, {
               to: maskEmail(email),
               from: maskEmail(smtpUser),
            });
            await transporter.sendMail({
               from: `"Manounou" <${smtpUser}>`,
               to: email,
               subject: "Votre code de vérification",
               html: `<p>Votre code OTP est <b>${otp}</b>. Il expire dans 10 minutes.</p>`,
            });
            console.log(`[send-otp][${requestId}] Email sent successfully`);
         } catch (e) {
            console.error(`[send-otp][${requestId}] Email send failed`, normalizeError(e));
            return NextResponse.json(
               {
                  success: false,
                  message: "Échec d'envoi de l'email OTP",
                  requestId,
               },
               { status: 502 }
            );
         }
      } else {
         console.warn(`[send-otp][${requestId}] Missing SMTP credentials, fallback to dev log`);
         console.log(`[DEV MODE][${requestId}] OTP for ${maskEmail(email)} is ${otp}`);
      }

      console.log(`[send-otp][${requestId}] Completed successfully`);
      return NextResponse.json({ success: true, message: "Code OTP envoyé" }, { status: 200 });
   } catch (error) {
      console.error(`[send-otp][${requestId}] Unexpected error`, normalizeError(error));
      return NextResponse.json(
         { success: false, message: "Erreur serveur", requestId },
         { status: 500 }
      );
   }
}
