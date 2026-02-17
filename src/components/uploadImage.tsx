"use client";

import { ChangeEvent, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { motion } from "framer-motion";

interface UploadImageProps {
  onUpload?: (imageData: UploadedImageData) => void;
  onRemove?: () => void;
  maxSize?: number;
  folder?: string;
  initialImageUrl?: string;
  initialPublicId?: string;
}

export interface UploadedImageData {
  url: string;
  publicId: string;
}

export interface UploadImageRef {
  openFileDialog: () => void;
}

const UploadImage = forwardRef<UploadImageRef, UploadImageProps>(({
  onUpload,
  onRemove,
  maxSize = 5 * 1024 * 1024,
  folder = "uploads",
  initialImageUrl,
  initialPublicId,
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [publicId, setPublicId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useImperativeHandle(ref, () => ({
    openFileDialog: () => fileInputRef.current?.click()
  }));

  useEffect(() => {
    setPreview(initialImageUrl || null);
    setPublicId(initialPublicId || null);
  }, [initialImageUrl, initialPublicId]);

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME || process.env.KEY_NAME;

  const uploadPreset = "ma_nounous";


  const handleFileUpload = async (file: File) => {
    setUploading(true);
    setError(null);

    if (!cloudName) {
      setError("Configuration Cloudinary manquante");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    formData.append("upload_preset", uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      console.log(data);

      if (res.ok) {
        const uploadedUrl = data.secure_url || data.url;
        const uploadedPublicId = data.public_id;

        setPublicId(uploadedPublicId || null);

        if (uploadedUrl && uploadedPublicId) {
          onUpload?.({
            url: uploadedUrl,
            publicId: uploadedPublicId,
          });
        }
      } else {
        setError(data.error || "Erreur lors de l'upload");
      }
    } catch (err) {
      console.error("Erreur upload:", err);
      setError("Erreur serveur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) {
      setError(`Le fichier est trop volumineux. Taille max: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    if (!selectedFile.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide");
      return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(selectedFile);

    handleFileUpload(selectedFile);
  };

  const handleRemove = async () => {
    setError(null);

    if (publicId) {

      try {
        const res = await fetch("/api/upload/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ public_id: publicId })
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setError(data?.error || "Erreur lors de la suppression");
          return;
        } else {
          console.log("Image supprimée avec succès")
        }

      } catch (err) {
        console.error("Erreur suppression:", err);
        setError("Erreur serveur lors de la suppression");
        return;
      }
    }

    setPreview(null);
    setPublicId(null);
    setError(null);
    onRemove?.();
  };

  return (
    <div className="upload-image-container flex flex-col items-start w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

      {uploading && (
        <div className="relative h-2 w-full overflow-hidden rounded bg-gradient-to-r from-blue-50 to-blue-100">
          <motion.div
            className="absolute inset-y-0 left-0 w-1/3 rounded bg-gradient-to-r from-orange-200 via-orange-400 to-orange-600 shadow-lg"
            animate={{
              x: ["-33%", "320%"],
              scale: [1, 1.05, 1],
              opacity: [0.9, 1, 0.9]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1], // easing personnalisé pour un mouvement plus fluide
              times: [0, 0.5, 1]
            }}
          />
          <motion.div
            className="absolute inset-y-0 left-0 w-1/3 rounded bg-orange-400/40 blur-sm"
            animate={{
              x: ["-33%", "133%"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: [0.45, 0, 0.55, 1],
              delay: 0.1
            }}
          />
        </div>
      )}

      <div className="bg-red-400 text-neutral-300 w-full rounded">

      </div>

      {preview && (
        <div className="preview-container mt-4 w-full max-w-xs relative">
          <img
            src={preview}
            alt="Aperçu"
            className="w-full h-auto max-h-80 rounded-lg"
          />
          <button
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
});

UploadImage.displayName = "UploadImage";

export default UploadImage;
