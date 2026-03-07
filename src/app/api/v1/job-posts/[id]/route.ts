import { jobsControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

interface RouteParams {
   params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return jobsControllerV1.getJobPost(id);
}

export async function PATCH(request: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return jobsControllerV1.updateJobPost(request, id);
}

export async function DELETE(_: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return jobsControllerV1.deleteJobPost(id);
}
