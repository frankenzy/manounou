import { socialControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

export async function GET() {
   return socialControllerV1.listPosts();
}

export async function POST(request: NextRequest) {
   return socialControllerV1.createPost(request);
}
