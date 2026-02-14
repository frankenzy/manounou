import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

type ResourceType = "image" | "video" | "raw";

type SignatureRequest = {
  resource_type?: ResourceType;
  folder?: string;
  timestamp?: number;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

type SignatureResponse = {
  success: boolean;
  message?: string;
  signature?: string;
  timestamp?: number;
  apiKey?: string;
  cloudName?: string;
  folder?: string;
  resource_type?: ResourceType;
  allowed_formats?: string;
};

const ALLOWED_FORMATS: Record<ResourceType, string[]> = {
  image: ["jpg", "jpeg", "png", "webp"],
  video: ["mp4", "mov"],
  raw: ["pdf"],
};

const SIZE_LIMITS: Record<ResourceType, number> = {
  image: 5 * 1024 * 1024,
  video: 50 * 1024 * 1024,
  raw: 10 * 1024 * 1024,
};

const TIMESTAMP_TOLERANCE_SECONDS = 10 * 60;

const badRequest = (res: NextApiResponse<SignatureResponse>, message: string) =>
  res.status(400).json({ success: false, message });

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignatureResponse>
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res
      .status(405)
      .json({ success: false, message: "Method Not Allowed" });
  }

  const {
    resource_type,
    folder,
    timestamp,
    fileName,
    fileType,
    fileSize,
  } = (req.body || {}) as SignatureRequest;

  if (!resource_type || !ALLOWED_FORMATS[resource_type]) {
    return badRequest(res, "Invalid resource_type");
  }

  if (!folder || typeof folder !== "string") {
    return badRequest(res, "Invalid folder");
  }

  if (!timestamp || typeof timestamp !== "number") {
    return badRequest(res, "Invalid timestamp");
  }

  if (!fileName || typeof fileName !== "string") {
    return badRequest(res, "Invalid fileName");
  }

  if (!fileType || typeof fileType !== "string") {
    return badRequest(res, "Invalid fileType");
  }

  if (!fileSize || typeof fileSize !== "number") {
    return badRequest(res, "Invalid fileSize");
  }

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > TIMESTAMP_TOLERANCE_SECONDS) {
    return badRequest(res, "Timestamp out of range");
  }

  const ext = fileName.split(".").pop()?.toLowerCase();
  const allowedFormats = ALLOWED_FORMATS[resource_type];
  if (!ext || !allowedFormats.includes(ext)) {
    return badRequest(res, "File format not allowed");
  }

  const sizeLimit = SIZE_LIMITS[resource_type];
  if (fileSize > sizeLimit) {
    return badRequest(res, "File too large");
  }

  const isImage = fileType.startsWith("image/");
  const isVideo = fileType.startsWith("video/");
  const isPdf = fileType === "application/pdf";

  if (
    (resource_type === "image" && !isImage) ||
    (resource_type === "video" && !isVideo) ||
    (resource_type === "raw" && !isPdf)
  ) {
    return badRequest(res, "File type mismatch");
  }

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiKey || !apiSecret || !cloudName) {
    return res.status(500).json({
      success: false,
      message: "Cloudinary credentials missing",
    });
  }

  const allowedFormatsValue = allowedFormats.join(",");

  const paramsToSign: Record<string, string | number> = {
    allowed_formats: allowedFormatsValue,
    folder,
    timestamp,
  };

  const signatureBase = Object.keys(paramsToSign)
    .sort()
    .map((key) => `${key}=${paramsToSign[key]}`)
    .join("&");

  const signature = crypto
    .createHash("sha1")
    .update(signatureBase + apiSecret)
    .digest("hex");

  return res.status(200).json({
    success: true,
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    resource_type,
    allowed_formats: allowedFormatsValue,
  });
}
