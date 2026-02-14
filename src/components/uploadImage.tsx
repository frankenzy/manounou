import { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from "react";

export interface UploadResult {
  secureUrl: string;
  publicId: string;
  resourceType: "image" | "video" | "raw";
  format: string;
  bytes: number;
  originalFileName: string;
}

interface UploadImageProps {
  onUpload?: (result: UploadResult) => void;
  onRemove?: () => void;
  maxSize?: number;
  folderBase?: string;
  entityId?: string | number;
}

export interface UploadImageRef {
  openFileDialog: () => void;
}

const UploadImage = forwardRef<UploadImageRef, UploadImageProps>(({
  onUpload,
  onRemove,
  maxSize,
  folderBase,
  entityId,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewType, setPreviewType] = useState<"image" | "video" | "pdf" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useImperativeHandle(ref, () => ({
    openFileDialog: () => {
      fileInputRef.current?.click();
    }
  }));

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    const fileType = selectedFile.type;
    const isImage = fileType.startsWith("image/");
    const isVideo = fileType.startsWith("video/");
    const isPdf = fileType === "application/pdf";

    if (!isImage && !isVideo && !isPdf) {
      setError("Type de fichier non supporte (image, video, pdf)");
      return;
    }

    const resourceType: "image" | "video" | "raw" = isImage
      ? "image"
      : isVideo
        ? "video"
        : "raw";

    const sizeLimits: Record<"image" | "video" | "raw", number> = {
      image: 5 * 1024 * 1024,
      video: 50 * 1024 * 1024,
      raw: 10 * 1024 * 1024,
    };

    const sizeLimit = maxSize ?? sizeLimits[resourceType];
    if (selectedFile.size > sizeLimit) {
      setError(
        `Le fichier est trop volumineux. Taille maximale: ${Math.round(
          sizeLimit / 1024 / 1024
        )}MB`
      );
      return;
    }

    setError(null);

    if (isImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        setPreviewType("image");
      };
      reader.readAsDataURL(selectedFile);
    } else if (isVideo) {
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setPreviewType("video");
    } else {
      setPreview(selectedFile.name);
      setPreviewType("pdf");
    }

    try {
      setIsUploading(true);
      const timestamp = Math.floor(Date.now() / 1000);
      const envSegment = process.env.NODE_ENV === "production" ? "prod" : "dev";
      const year = new Date().getFullYear();
      const month = String(new Date().getMonth() + 1).padStart(2, "0");
      const typeSegment = resourceType === "image" ? "img" : resourceType === "video" ? "vid" : "doc";
      const idSegment = entityId ? String(entityId) : "draft";
      const baseFolder = folderBase ?? `manounou/${envSegment}/announcements`;
      const folder = `${baseFolder}/${idSegment}/${typeSegment}/${year}/${month}`;

      const signatureResponse = await fetch("/api/cloudinary/signature", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          resource_type: resourceType,
          folder,
          timestamp,
          fileName: selectedFile.name,
          fileType: selectedFile.type,
          fileSize: selectedFile.size,
        }),
      });

      const signatureData = await signatureResponse.json();
      if (!signatureResponse.ok || !signatureData.success) {
        setError(signatureData.message || "Signature invalide");
        setIsUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("api_key", signatureData.apiKey);
      formData.append("timestamp", String(signatureData.timestamp));
      formData.append("signature", signatureData.signature);
      formData.append("folder", signatureData.folder);
      formData.append("allowed_formats", signatureData.allowed_formats);
      formData.append("resource_type", signatureData.resource_type);

      const uploadResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/${signatureData.resource_type}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok) {
        setError(uploadResult?.error?.message || "Echec de l'upload");
        setIsUploading(false);
        return;
      }

      console.log("Upload successful:", uploadResult.secure_url);

      if (onUpload) {
        onUpload({
          secureUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          resourceType: uploadResult.resource_type,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          originalFileName: selectedFile.name,
        });
      }
    } catch (uploadError) {
      console.error("Upload error:", uploadError);
      setError("Erreur lors de l'upload");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    if (previewType === "video" && preview?.startsWith("blob:")) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setPreviewType(null);
    setError(null);
    if (onRemove) onRemove();
  };

  return (
    <div className="upload-image-container flex flex-col items-start w-full">

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*,application/pdf"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      {/* Afficher uniquement l'aperçu de l'image */}
      {preview && (
        <div className="preview-container mt-4 w-full">
          <div className="relative w-full max-w-[20rem]">
            {previewType === "image" && (
              <picture>
                <img
                  src={preview}
                  alt="Apercu"
                  className="w-full h-auto max-h-80 rounded-lg"
                />
              </picture>
            )}
            {previewType === "video" && (
              <video
                src={preview}
                controls
                className="w-full h-auto max-h-80 rounded-lg"
              />
            )}
            {previewType === "pdf" && (
              <div className="rounded-lg border border-gray-200 p-3 text-sm">
                {preview}
              </div>
            )}
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
              disabled={isUploading}
              type="button"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

UploadImage.displayName = 'UploadImage';

export default UploadImage;

