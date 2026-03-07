import { userControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

export async function GET() {
   return userControllerV1.listReports();
}

export async function POST(request: NextRequest) {
   return userControllerV1.createReport(request);
}
