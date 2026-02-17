"use client";

import Modal from "@/components/Modal";
import UploadImage, { UploadImageRef, UploadedImageData } from "@/components/uploadImage";
import { IAnnouncementDTO } from "@/models/Annnouncements";
import {
  faCalendar,
  faClock,
  faImage,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";

interface CreateAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  announcement?: IAnnouncementDTO;
}

interface IMetadata {
  fontSize: string;
  backgroundColor: string;
  background: string;
  location: string;
  audience: string;
  relationSheep: string;
  calendar: string;
  idCard: string;
  image: string;
  imagePublicId: string;
}

const lengthLimit = 140;

export default function CreateAnnouncement({
  isOpen,
  onClose,
  onSuccess,
  announcement,
}: CreateAnnouncementProps) {
  const isEditMode = !!announcement;
  const uploadImageRef = useRef<UploadImageRef>(null);
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

  // Pré-remplir le formulaire en mode édition
  useEffect(() => {
    if (announcement && isOpen) {
      setAnnouncementTitle(announcement.title || "");
      setInputValue(announcement.description || "");

      if (announcement.metadata) {
        setMetadata(announcement.metadata as unknown as IMetadata);

        // Restaurer le style de fond si présent
        const bgColor = announcement.metadata.background || announcement.metadata.backgroundColor;
        if (bgColor) {
          setInputBg(`${bgColor} p-8`);
          setInputColor(
            "text-white dark:text-black text-[clamp(1rem,2vw,2rem)] font-bold text-center"
          );
          setLastSelectedColor(bgColor as string);
        }
      }
    } else if (!isOpen) {
      // Reset quand on ferme le modal
      resetForm();
    }
  }, [announcement, isOpen]);

  const handleInputBg = (color: string) => {
    if (inputValue.length > lengthLimit) {
      return;
    }
    setInputBg(`${color} p-8`);
    setInputColor(
      "text-white dark:text-black text-[clamp(1rem,2vw,2rem)] font-bold text-center",
    );
    setLastSelectedColor(color);
    setMetadata((prev) => ({
      ...prev,
      background: color,
      backgroundColor: color,
    }));
  };

  // Fonction pour réinitialiser uniquement les styles (sans perdre le contenu)
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

  // Fonction pour réinitialiser complètement le formulaire (appelée à la fermeture)
  const resetForm = () => {
    setInputBg("bg-white");
    setInputColor("text-black");
    setLastSelectedColor("");
    setInputValue("");
    setAnnouncementTitle("");

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
    });

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleSubmit = async () => {
    try {
      const url = isEditMode
        ? `/api/announcements/${announcement?.id}`
        : "/api/announcements";

      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: announcement?.user_id || "1",
          title: announcementTitle || "Nouvelle annonce",
          description: inputValue,
          location: metadata.location || announcement?.location || "Non spécifié",
          metadata: {
            ...metadata,
            image: metadata.image || announcement?.metadata?.image || "",
            imagePublicId: metadata.imagePublicId || announcement?.metadata?.imagePublicId || "",
          },
        }),

      });

      const result = await response.json();

      if (result.success) {
        console.log(
          isEditMode ? "Annonce modifiée avec succès:" : "Annonce créée avec succès:",
          result.data
        );
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
        alert(
          isEditMode
            ? "Annonce modifiée avec succès !"
            : "Annonce créée avec succès !"
        );
      } else {
        console.error(
          isEditMode ? "Erreur lors de la modification:" : "Erreur lors de la création:",
          result.message
        );
        alert(`Erreur: ${result.message}`);
      }
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
      alert(
        isEditMode
          ? "Une erreur est survenue lors de la modification de l'annonce"
          : "Une erreur est survenue lors de la création de l'annonce"
      );
    }
  };

  const handleCloseModal = () => {
    resetForm();
    onClose();
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const value = e.target.value;
    if (value.length > lengthLimit) {
      resetStyles();
    } else if (value.length <= lengthLimit && lastSelectedColor) {
      handleInputBg(lastSelectedColor);
    }
    setInputValue(e.target.value);
  };

  const handleLoadingImage = () => {
    resetStyles();
    setShowUploadImage(true);
    setTimeout(() => {
      uploadImageRef.current?.openFileDialog();
    }, 100);
  };

  const handleImageUpload = ({ url, publicId }: UploadedImageData) => {
    console.log("Image uploaded avec succes !!!: ", { url, publicId });
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

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal} className="my-modal">
      <div className="p-6">
        <div className="modalHeader flex items-center justify-between">
          <div className="void">x</div>
          <h2 className="text-[clamp(1rem,2vw,2rem)] font-bold mb-4">
            {isEditMode ? "Modifier l'annonce" : "Publier"}
          </h2>
          <button
            className="flex items-end justify-end text-3xl mb-4"
            onClick={handleCloseModal}
          >
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <hr className="mb-4" />

        {/* Section formulaire */}
        <div
          className={`modal modalForms row justify-normal items-center rounded-lg gap-4 my-8 ${inputBg}`}
        >
          <textarea
            ref={textareaRef}
            value={inputValue}
            placeholder="Décrire votre publication..."
            className={`flex flex-auto w-full p-2 rounded-lg focus:outline-none bg-inherit resize-none overflow-y-auto ${inputColor}`}
            style={{ minHeight: "60px", maxHeight: "180px" }}
            onChange={handleInput}
          />
          {showUploadImage && (
            <div className="flex flex-auto items-center justify-start">
              <UploadImage
                ref={uploadImageRef}
                onUpload={handleImageUpload}
                onRemove={handleImageRemove}
              />
            </div>
          )}
        </div>

        {/* Boutons de couleur */}
        <div className="flex-auto flex flex-row gap-4 text-[clamp(1rem,2vw,1.5rem)] justify-start items-start mb-4">
          <button
            className="w-5 bg-orange-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
            onClick={() =>
              handleInputBg("bg-gradient-to-br from-orange-500 to-orange-600")
            }
          />
          <button
            className="w-5 bg-green-600 rounded-md h-6 p-2 text-white flex items-center justify-center"
            onClick={() =>
              handleInputBg("bg-gradient-to-br from-green-600 to-emerald-700")
            }
          />
          <button
            className="w-5 bg-red-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
            onClick={() =>
              handleInputBg("bg-gradient-to-br from-red-500 to-yellow-500")
            }
          />
          <button
            className="w-5 bg-yellow-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
            onClick={() =>
              handleInputBg("bg-gradient-to-br from-amber-400 to-orange-500")
            }
          />
          <button
            className="w-5 bg-gray-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
            onClick={() =>
              handleInputBg("bg-gradient-to-br from-slate-600 to-slate-800")
            }
          />
          <button
            className="w-5 bg-white rounded-md h-6 p-2 text-white flex items-center justify-center border-2 border-black"
            onClick={() => resetStyles()}
          />
        </div>

        {/* Icônes */}
        <div className="icons flex flex-row text-[clamp(1.5rem,2vw,2.5rem)] justify-start items-start gap-12">
          <div className="flex justify-start items-start">
            <FontAwesomeIcon
              icon={faImage}
              onClick={handleLoadingImage}
              color="gray"
              size="sm"
            />
          </div>
          <div className="flex justify-start items-start">
            <FontAwesomeIcon
              icon={faUser}
              color="gray"
              size="sm"
              onClick={handleSetUser}
            />
          </div>
          <div className="flex justify-start items-start">
            <FontAwesomeIcon
              icon={faCalendar}
              color="gray"
              size="sm"
              onClick={handleSetCalendar}
            />
          </div>
          <div className="flex justify-start items-start">
            <FontAwesomeIcon
              icon={faClock}
              color="gray"
              size="sm"
              onClick={handleSetIdCard}
            />
          </div>
        </div>

        {/* Bouton de soumission */}
        <div className="flex justify-center items-center mt-4">
          <button
            className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 w-full"
            onClick={handleSubmit}
          >
            {isEditMode ? "Mettre à jour" : "Suivant"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
