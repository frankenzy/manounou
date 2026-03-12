import { IPostDTO } from "@/models/Post";
import { UploadedImageData } from "@/components/uploadImage";
import { useCallback, useEffect, useRef, useState } from "react";
import { PostFormData, IMetadata, LENGTH_LIMIT } from "./types";

const getInitialMetadata = (): IMetadata => ({
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

export const usePostForm = (post?: IPostDTO, isOpen?: boolean) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [inputValue, setInputValue] = useState("");
  const [inputBg, setInputBg] = useState("");
  const [inputColor, setInputColor] = useState("");
  const [lastSelectedColor, setLastSelectedColor] = useState("");
  const [showUploadImage, setShowUploadImage] = useState(false);
  const [postTitle, setPostTitle] = useState("");

  const [metadata, setMetadata] = useState<IMetadata>(getInitialMetadata());

  // Ajustement automatique de la hauteur du textarea
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
  const resetForm = useCallback(() => {
    setInputBg("bg-white");
    setInputColor("text-black");
    setLastSelectedColor("");
    setInputValue("");
    setPostTitle("");
    setShowUploadImage(false);
    setMetadata(getInitialMetadata());

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, []);

  // Pré-remplir le formulaire en mode édition sans conserver de traces précédentes
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (!post) {
      resetForm();
      return;
    }

    const postMetadata = (post.metadata || {}) as Partial<IMetadata>;
    const mergedMetadata: IMetadata = {
      ...getInitialMetadata(),
      ...postMetadata,
      tags: Array.isArray(postMetadata.tags) ? postMetadata.tags : [],
      attachments: Array.isArray(postMetadata.attachments)
        ? postMetadata.attachments
        : [],
    };

    setPostTitle(post.title || "");
    setInputValue(post.description || "");
    setMetadata(mergedMetadata);
    setShowUploadImage(Boolean(mergedMetadata.image));

    const bgColor = mergedMetadata.background || mergedMetadata.backgroundColor;
    if (bgColor) {
      setInputBg(`${bgColor} p-8`);
      setInputColor(
        "text-white dark:text-black text-[clamp(1rem,2vw,2rem)] font-bold text-center"
      );
      setLastSelectedColor(bgColor);
    } else {
      setInputBg("bg-white");
      setInputColor("text-black");
      setLastSelectedColor("");
    }
  }, [post, isOpen, resetForm]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length > LENGTH_LIMIT) {
      resetStyles();
    } else if (value.length <= LENGTH_LIMIT && lastSelectedColor) {
      handleInputBg(lastSelectedColor);
    }
    setInputValue(value);
  };

  const handleLoadingImage = () => {
    resetStyles();
    setShowUploadImage(true);
  };

  const handleImageUpload = ({ url, publicId }: UploadedImageData) => {
    console.log("Image uploaded: ", { url, publicId });
    setMetadata((prev) => ({
      ...prev,
      image: url,
      imagePublicId: publicId,
    }));
  };

  const handleImageRemove = () => {
    console.log("Image removed");
    setMetadata((prev) => ({
      ...prev,
      image: "",
      imagePublicId: "",
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
  const getFormData = (): PostFormData => ({
    title: postTitle || "Nouvelle annonce",
    description: inputValue,
    location: metadata.location || post?.location || "Non spécifié",
    parent_id: post?.parent_id,
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
    postTitle,
    metadata,
    image: metadata.image
      ? {
        url: metadata.image,
        publicId: metadata.imagePublicId || "",
      }
      : undefined,

    // Setters
    setPostTitle,

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
