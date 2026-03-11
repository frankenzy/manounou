import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface CheckPhoneBody {
   phone?: string;
}

export async function POST(request: Request) {
   try {
      const body = (await request.json()) as CheckPhoneBody;
      const phone = body.phone?.trim();

      if (!phone) {
         return NextResponse.json(
            { success: false, message: "Numéro de téléphone requis" },
            { status: 400 },
         );
      }

      if (!/^[0-9]{10}$/.test(phone)) {
         return NextResponse.json(
            { success: false, message: "Format de téléphone invalide" },
            { status: 400 },
         );
      }

      console.log("Checking phone existence for:", phone);

      const user = await prisma.user.findUnique({
         where: { phone },
         select: { id: true },
      });

      return NextResponse.json(
         {
            success: true,
            exists: Boolean(user),
         },
         { status: 200 },
      );
   } catch (error) {
      console.error("Check phone error:", error);
      return NextResponse.json(
         { success: false, message: "Erreur interne du serveur" },
         { status: 500 },
      );
   }
}