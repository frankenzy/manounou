import { userControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

interface RouteParams {
   params: Promise<{ id: string }>;
}

export async function GET(_: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return userControllerV1.listDocuments(id);
}

export async function POST(request: NextRequest, context: RouteParams) {
   const { id } = await context.params;
   return userControllerV1.createDocument(request, id);
}
