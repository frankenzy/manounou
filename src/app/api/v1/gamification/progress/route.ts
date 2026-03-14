import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface GameProgress {
   score: number;
   level: number;
   xp: number;
   updatedAt: string;
}

function getMetaDataObject(metaData: unknown): Record<string, unknown> {
   if (metaData && typeof metaData === "object" && !Array.isArray(metaData)) {
      return { ...(metaData as Record<string, unknown>) };
   }
   return {};
}

function normalizeProgress(input: unknown): GameProgress {
   if (!input || typeof input !== "object") {
      return { score: 0, level: 1, xp: 0, updatedAt: new Date().toISOString() };
   }

   const data = input as Partial<GameProgress>;
   return {
      score: Number.isFinite(data.score) ? Math.max(0, Number(data.score)) : 0,
      level: Number.isFinite(data.level) ? Math.max(1, Number(data.level)) : 1,
      xp: Number.isFinite(data.xp) ? Math.max(0, Number(data.xp)) : 0,
      updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : new Date().toISOString(),
   };
}

export async function GET(request: NextRequest) {
   try {
      const userId = request.nextUrl.searchParams.get("userId");
      if (!userId) {
         return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: userId }, select: { metaData: true } });
      if (!user) {
         return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }

      const metaData = getMetaDataObject(user.metaData);
      const game = normalizeProgress(metaData.game);
      return NextResponse.json({ success: true, data: game }, { status: 200 });
   } catch (error) {
      console.error("Gamification GET error:", error);
      return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
   }
}

export async function POST(request: NextRequest) {
   try {
      const body = (await request.json()) as {
         userId?: string;
         score?: number;
         level?: number;
         xp?: number;
      };

      if (!body.userId) {
         return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 });
      }

      const user = await prisma.user.findUnique({ where: { id: body.userId }, select: { metaData: true } });
      if (!user) {
         return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
      }

      const metaData = getMetaDataObject(user.metaData);
      const previous = normalizeProgress(metaData.game);

      const candidateScore = Number.isFinite(body.score) ? Math.max(0, Number(body.score)) : previous.score;
      const candidateXp = Number.isFinite(body.xp) ? Math.max(previous.xp, Number(body.xp)) : previous.xp;
      const computedLevel = Math.floor(candidateXp / 100) + 1;
      const candidateLevel = Number.isFinite(body.level)
         ? Math.max(computedLevel, Number(body.level))
         : Math.max(computedLevel, previous.level);

      const nextProgress: GameProgress = {
         score: Math.max(previous.score, candidateScore),
         xp: candidateXp,
         level: candidateLevel,
         updatedAt: new Date().toISOString(),
      };

      const nextMetaData = {
         ...metaData,
         game: nextProgress,
      };

      await prisma.user.update({
         where: { id: body.userId },
         data: { metaData: nextMetaData as unknown as Prisma.InputJsonValue },
      });

      return NextResponse.json({ success: true, data: nextProgress }, { status: 200 });
   } catch (error) {
      console.error("Gamification POST error:", error);
      return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
   }
}
