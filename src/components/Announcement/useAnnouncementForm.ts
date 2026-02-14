import { IAnnouncementDTO } from "@/models/Annnouncements";
import { useEffect, useRef, useState } from "react";
import type { UploadResult } from "@/components/uploadImage";
import { AnnouncementFormData, IMetadata, LENGTH_LIMIT } from "./types";

export const useAnnouncementForm = (announcement?: IAnnouncementDTO) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [inputValue, setInputValue] = useState("");
  const [inputBg, setInputBg] = useState("");
  const [inputColor, setInputColor] = useState("");
  const [lastSelectedColor, setLastSelectedColor] = useState("");
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState("");
  
  const [metadata, setMetadata] = useState<IMetadata>({
    fontSize: "",
    backgroundColor: "",
    background: "",
    location: "",
    audience: "",
    relationSheep: "",
    calendar: "",
    idCard: "",
    image: "",
    imagePublicId: "",
    imageResourceType: "",
    imageFormat: "",
    imageBytes: "",
   tags: [],
   category: "",
   author: "",
   contact: "",
   startDate: "",
   endDate: "",
   visibility: "",
   priority: "",
   pinned: false,
   link: "",
   attachments: [],
   textAlign: "",
   fontWeight: "",
   lineHeight: "",
   ctaText: "",
   ctaUrl: "",
   locale: "",
   createdAt: "",
   updatedAt: "",
  });

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 180);
      textarea.style.height = `${newHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);

  useEffect(() => {
    if (announcement) {
      setAnnouncementTitle(announcement.title || "");
      setInputValue(announcement.description || "");
      
      if (announcement.metadata) {
        setMetadata(announcement.metadata as unknown as IMetadata);
        
        const bgColor = announcement.metadata.background || announcement.metadata.backgroundColor;
        if (bgColor) {
          setInputBg(`${bgColor} p-8`);
          setInputColor(
            "text-white dark:text-black text-[clamp(1rem,2vw,2rem)] font-bold text-center"
          );
          setLastSelectedColor(bgColor as string);
        }
      }
    }
  }, [announcement]);

  // Gestion du background color
  const handleInputBg = (color: string) => {
    if (inputValue.length > LENGTH_LIMIT) {
      return;
    }
    setInputBg(`${color} p-8`);
    setInputColor(
      "text-white dark:text-black text-[clamp(1rem,2vw,2rem)] font-bold text-center"
    );
    setLastSelectedColor(color);
    setMetadata((prev) => ({
      ...prev,
      background: color,
      backgroundColor: color,
    }));
  };

  // Reset des styles uniquement
  const resetStyles = () => {
    setInputBg("bg-white");
    setInputColor("text-black");
    setLastSelectedColor("");

    setMetadata((prev) => ({
      ...prev,
      fontSize: "",
      backgroundColor: "",
      background: "",
    }));

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Reset complet du formulaire
  const resetForm = () => {
    setInputBg("bg-white");
    setInputColor("text-black");
    setLastSelectedColor("");
    setInputValue("");
    setAnnouncementTitle("");
    setShowUploadImage(false);

    setMetadata({
      fontSize: "",
      backgroundColor: "",
      background: "",
      location: "",
      audience: "",
      relationSheep: "",
      calendar: "",
      idCard: "",
      image: "",
      imagePublicId: "",
      imageResourceType: "",
      imageFormat: "",
      imageBytes: "",
      tags: [],
      category: "",
      author: "",
      contact: "",
      startDate: "",
      endDate: "",
      visibility: "",
      priority: "",
      pinned: false,
      link: "",
      attachments: [],
      textAlign: "",
      fontWeight: "",
      lineHeight: "",
      ctaText: "",
      ctaUrl: "",
      locale: "",
      createdAt: "",
      updatedAt: "",
    });

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Gestion de l'input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > LENGTH_LIMIT) {
      resetStyles();
    } else if (value.length <= LENGTH_LIMIT && lastSelectedColor) {
      handleInputBg(lastSelectedColor);
    }
    setInputValue(value);
  };

  // Gestion de l'image
  const handleLoadingImage = () => {
    resetStyles();
    setShowUploadImage(true);
  };

  const handleImageUpload = (result: UploadResult) => {
    console.log("Upload result:", result.secureUrl);
    setMetadata((prev) => ({
      ...prev,
      image: result.secureUrl,
      imagePublicId: result.publicId,
      imageResourceType: result.resourceType,
      imageFormat: result.format,
      imageBytes: String(result.bytes),
    }));
  };

  const handleImageRemove = () => {
    console.log("Image removed");
    setMetadata((prev) => ({
      ...prev,
      image: "",
      imagePublicId: "",
      imageResourceType: "",
      imageFormat: "",
      imageBytes: "",
    }));
  };

  // Gestion des métadonnées
  const handleSetUser = () => {
    resetStyles();
    setMetadata((prev) => ({
      ...prev,
      audience: "user-selected",
    }));
  };

  const handleSetIdCard = () => {
    setMetadata((prev) => ({
      ...prev,
      idCard: "id-selected",
    }));
  };

  const handleSetCalendar = () => {
    resetStyles();
    setMetadata((prev) => ({
      ...prev,
      calendar: new Date().toISOString(),
    }));
  };

  // Récupérer les données du formulaire
  const getFormData = (): AnnouncementFormData => ({
    title: announcementTitle || "Nouvelle annonce",
    description: inputValue,
    metadata,
  });

  return {
    // Refs
    textareaRef,
    
    // State
    inputValue,
    inputBg,
    inputColor,
    showUploadImage,
    announcementTitle,
    metadata,
    
    // Setters
    setAnnouncementTitle,
    
    // Handlers
    handleInput,
    handleInputBg,
    handleLoadingImage,
    handleImageUpload,
    handleImageRemove,
    handleSetUser,
    handleSetIdCard,
    handleSetCalendar,
    resetStyles,
    resetForm,
    
    // Utilities
    getFormData,
  };
};
