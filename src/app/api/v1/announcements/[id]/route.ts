import { NextRequest, NextResponse } from "next/server";
import { DeleteAnnouncementUseCase } from "@/modules/announcements/application/use-cases/deleteAnnouncement";
import { GetAnnouncementByIdUseCase } from "@/modules/announcements/application/use-cases/getAnnouncementById";
import { UpdateAnnouncementUseCase } from "@/modules/announcements/application/use-cases/updateAnnouncement";
import { PrismaAnnouncementRepository } from "@/modules/announcements/infrastructure/persistence/prisma/PrismaAnnouncementRepository";
import { fail, ok } from "@/shared/lib/api-response";
import { getTenantContext } from "@/shared/lib/tenant-context";

const repository = new PrismaAnnouncementRepository();
const getAnnouncementByIdUseCase = new GetAnnouncementByIdUseCase(repository);
const updateAnnouncementUseCase = new UpdateAnnouncementUseCase(repository);
const deleteAnnouncementUseCase = new DeleteAnnouncementUseCase(repository);

type RouteContext = {
   params: Promise<{ id: string }>;
};

export async function GET(request: NextRequest, context: RouteContext) {
   const { id } = await context.params;

   try {
      const tenant = getTenantContext(request);
      const data = await getAnnouncementByIdUseCase.execute(tenant.workspaceId, id);

      if (!data) {
         return NextResponse.json(fail("Announcement not found"), { status: 404 });
      }

      return NextResponse.json(ok(data));
   } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to get announcement";
      return NextResponse.json(fail(message), { status: 500 });
   }
}

export async function PUT(request: NextRequest, context: RouteContext) {
   const { id } = await context.params;

   try {
      const tenant = getTenantContext(request);
      const body = await request.json();

      const updated = await updateAnnouncementUseCase.execute(tenant.workspaceId, id, {
         title: body.title,
         description: body.description,
         location: body.location,
         metadata: body.metadata,
      });

      if (!updated) {
         return NextResponse.json(fail("Announcement not found"), { status: 404 });
      }

      return NextResponse.json(ok(updated, "Announcement updated"));
   } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update announcement";
      return NextResponse.json(fail(message), { status: 400 });
   }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
   const { id } = await context.params;

   try {
      const tenant = getTenantContext(request);
      const removed = await deleteAnnouncementUseCase.execute(tenant.workspaceId, id);

      if (!removed) {
         return NextResponse.json(fail("Announcement not found"), { status: 404 });
      }

      return NextResponse.json(ok({ id }, "Announcement deleted"));
   } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to delete announcement";
      return NextResponse.json(fail(message), { status: 500 });
   }
}
