import { messagingControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
   const userId = request.nextUrl.searchParams.get("userId") ?? undefined;
   return messagingControllerV1.listConversations(userId);
}

export async function POST(request: NextRequest) {
   return messagingControllerV1.createConversation(request);
}
