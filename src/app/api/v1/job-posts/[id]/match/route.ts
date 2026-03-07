import { jobsControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

interface RouteParams {
   params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return jobsControllerV1.createMatch(request, id);
}
