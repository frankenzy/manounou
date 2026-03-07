import { jobsControllerV1 } from "@/modules/v1/container";
import { NextRequest } from "next/server";

export async function GET() {
   return jobsControllerV1.listLocations();
}

export async function POST(request: NextRequest) {
   return jobsControllerV1.createLocation(request);
}
