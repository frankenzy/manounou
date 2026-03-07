import { userControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

interface RouteParams {
   params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return userControllerV1.getUser(id);
}

export async function PATCH(request: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return userControllerV1.updateUser(request, id);
}

export async function DELETE(_: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return userControllerV1.deleteUser(id);
}
