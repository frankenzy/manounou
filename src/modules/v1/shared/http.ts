import { NextResponse } from "next/server";

export class HttpError extends Error {
   constructor(
      public readonly status: number,
      message: string,
   ) {
      super(message);
      this.name = "HttpError";
   }
}

export function ok<T>(data: T, status = 200) {
   return NextResponse.json({ success: true, data }, { status });
}

export function fail(error: unknown) {
   if (error instanceof HttpError) {
      return NextResponse.json(
         { success: false, message: error.message },
         { status: error.status },
      );
   }

   console.error("API error:", error);
   return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
   );
}

export async function getJsonBody<T>(request: Request): Promise<T> {
   return (await request.json()) as T;
}

export function requireParam(value: string | undefined, label: string): string {
   if (!value || value.trim().length === 0) {
      throw new HttpError(400, `${label} is required`);
   }
   return value;
}
