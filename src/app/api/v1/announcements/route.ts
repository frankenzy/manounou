import { NextRequest, NextResponse } from "next/server";
import { CreateAnnouncementUseCase } from "@/modules/announcements/application/use-cases/createAnnouncement";
import { ListAnnouncementsUseCase } from "@/modules/announcements/application/use-cases/listAnnouncements";
import { PrismaAnnouncementRepository } from "@/modules/announcements/infrastructure/persistence/prisma/PrismaAnnouncementRepository";
import { fail, ok } from "@/shared/lib/api-response";
import { getTenantContext } from "@/shared/lib/tenant-context";

const repository = new PrismaAnnouncementRepository();
const listAnnouncementsUseCase = new ListAnnouncementsUseCase(repository);
const createAnnouncementUseCase = new CreateAnnouncementUseCase(repository);

export async function GET(request: NextRequest) {
   try {
      const tenant = getTenantContext(request);
      const { searchParams } = request.nextUrl;
      const page = Number(searchParams.get("page") ?? "1");
      const limit = Number(searchParams.get("limit") ?? "20");
      const search = searchParams.get("q") ?? undefined;

      const data = await listAnnouncementsUseCase.execute({
         workspaceId: tenant.workspaceId,
         page,
         limit,
         search,
      });

      return NextResponse.json(ok(data));
   } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to list announcements";
      return NextResponse.json(fail(message), { status: 500 });
   }
}

export async function POST(request: NextRequest) {
   try {
      const tenant = getTenantContext(request);
      const body = await request.json();

      if (!tenant.userId) {
         return NextResponse.json(fail("Unauthorized"), { status: 401 });
      }

      const created = await createAnnouncementUseCase.execute({
         workspaceId: tenant.workspaceId,
         authorId: tenant.userId,
         title: String(body.title ?? ""),
         description: String(body.description ?? ""),
         location: String(body.location ?? ""),
         metadata: body.metadata,
      });

      return NextResponse.json(ok(created, "Announcement created"), { status: 201 });
   } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create announcement";
      return NextResponse.json(fail(message), { status: 400 });
   }
}
