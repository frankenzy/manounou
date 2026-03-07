import { socialControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

interface RouteParams {
   params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return socialControllerV1.getPost(id);
}

export async function PATCH(request: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return socialControllerV1.updatePost(request, id);
}

export async function DELETE(_: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return socialControllerV1.deletePost(id);
}
