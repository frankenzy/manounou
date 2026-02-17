import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "@/lib/minio";

export async function POST(req: NextRequest) {
   try {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file) {
         return NextResponse.json({ error: "No file" }, { status: 400 });
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const command = new PutObjectCommand({
         Bucket: process.env.MINIO_BUCKET!,
         Key: file.name,
         Body: buffer,
         ContentType: file.type,
      });

      await s3.send(command);

      return NextResponse.json({ success: true });
   } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Upload failed" }, { status: 500 });
   }
}
