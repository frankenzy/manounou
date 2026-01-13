import { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from "react";

interface UploadImageProps {
  onUpload?: (file: File) => void;
  maxSize?: number;
}

export interface UploadImageRef {
  openFileDialog: () => void;
}

const UploadImage = forwardRef<UploadImageRef, UploadImageProps>(({ 
  onUpload, 
  maxSize = 5 * 1024 * 1024 
}, ref) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useImperativeHandle(ref, () => ({
    openFileDialog: () => {
      fileInputRef.current?.click();
    }
  }));

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    
    if (!selectedFile) return;

    if (selectedFile.size > maxSize) {
      setError(`Le fichier est trop volumineux. Taille maximale: ${maxSize / 1024 / 1024}MB`);
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Veuillez sélectionner une image valide');
      return;
    }

    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);

    if (onUpload) {
      onUpload(selectedFile);
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setError(null);
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

      {error && (
        <div className="text-red-500 text-sm mt-2">
          {error}
        </div>
      )}

      {/* Afficher uniquement l'aperçu de l'image */}
      {preview && (
        <div className="preview-container mt-4 w-full">
          <div className="relative w-full max-w-[20rem]">
            <img 
              src={preview} 
              alt="Aperçu" 
              className="w-full h-auto max-h-80 rounded-lg"
            />
            <button 
              onClick={handleRemove}
              className="absolute top-2 right-2 bg-red-500  text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition"
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
