"use client";

import Modal from "@/components/Modal";
import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import AnnouncementForm from "./AnnouncementCreateForm";
import { AnnouncementModalProps } from "./types";
import { useAnnouncementForm } from "./useAnnouncementForm";
import { useAnnouncementSubmit } from "./useAnnouncementSubmit";

export default function AnnouncementModal({
   isOpen,
   onClose,
   onSuccess,
   announcement,
   mode,
}: AnnouncementModalProps) {
   // Déterminer le mode automatiquement si non spécifié
   const isEditMode = mode === "edit" || !!announcement;

   // Hook pour la logique du formulaire
   const formLogic = useAnnouncementForm(announcement);

   // Hook pour la logique de soumission
   const { isSubmitting, error, createAnnouncement, updateAnnouncement } = useAnnouncementSubmit();

   // Reset du formulaire à la fermeture
   useEffect(() => {
      if (!isOpen) {
         formLogic.resetForm();
      }
   }, [isOpen]);

   const handleCloseModal = () => {
      formLogic.resetForm();
      onClose();
   };

   const handleSubmit = async () => {
      const formData = formLogic.getFormData();

      let result;
      if (isEditMode) {
         result = await updateAnnouncement(announcement?.id, formData, announcement);
      } else {
         result = await createAnnouncement(formData);
      }

      if (result.success) {
         handleCloseModal();
         if (onSuccess) onSuccess();
         alert(
            isEditMode
               ? "Annonce modifiée avec succès !"
               : "Annonce créée avec succès !"
         );
      } else {
         alert(result.error);
      }
   };


   const tabsContainerRef = useRef<HTMLDivElement | null>(null);
   const btnJobRef = useRef<HTMLButtonElement | null>(null);
   const btnEmpRef = useRef<HTMLButtonElement | null>(null);
   const [indicator, setIndicator] = useState<{ left: string; width: string }>({ left: "0px", width: "0px" });


   // const [tabs, setTabs] = useState<'job-seeker' | 'employer'>('job-seeker');
   const [tabs, setTabs] = useState<'job-seeker' | 'employer'>('job-seeker');
   useEffect(() => {
      const update = () => {
         const container = tabsContainerRef.current;
         const activeBtn = tabs === "job-seeker" ? btnJobRef.current : btnEmpRef.current;
         if (container && activeBtn) {
            const cRect = container.getBoundingClientRect();
            const bRect = activeBtn.getBoundingClientRect();
            setIndicator({ left: `${bRect.left - cRect.left}px`, width: `${bRect.width}px` });
         }
      };
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
   }, [tabs]);


   return (
      <Modal isOpen={isOpen} onClose={handleCloseModal} className="my-modal">
         <div className="p-6">
            <div className="modalHeader flex items-center justify-between">
               <div className="void"></div>
               <h2 className="text-[clamp(1rem,2vw,2rem)] font-bold mb-4">
                  {isEditMode ? "Modifier l'annonce" : "Publier une annonce"}
               </h2>
               <button
                  className="flex items-end justify-end text-3xl mb-4"
                  onClick={handleCloseModal}
                  type="button"
               >
                  <FontAwesomeIcon icon={faClose} />
               </button>
            </div>

            <div className="relative">
               <div className="flex">
                  <button

                     className={`flex-1 py-4 text-center font-semibold transition-colors duration-50 ${tabs === "job-seeker" ? "text-orange-600 shadow-md rounded-md" : "text-gray-600 hover:bg-gray-50"}`}
                     onClick={() => setTabs("job-seeker")}
                     aria-pressed={tabs === "job-seeker"}
                  >
                     Je cherche un travail
                  </button>

                  <button

                     className={`flex-1 py-4 text-center font-semibold transition-colors duration-50 ${tabs === "employer" ? "text-orange-600 shadow-md rounded-md" : "text-gray-600 hover:bg-gray-50"}`}
                     onClick={() => setTabs("employer")}
                     aria-pressed={tabs === "employer"}
                  >
                     J’ai besoin de quelqu’un
                  </button>
               </div>

               <span
                  aria-hidden
                  className="absolute bottom-0 h-0.5 bg-orange-500 rounded-full transition-all duration-300 ease-out shadow-sm"
               />
            </div>
            <hr className="mb-4" />

            <AnnouncementForm
               inputValue={formLogic.inputValue}
               inputBg={formLogic.inputBg}
               inputColor={formLogic.inputColor}
               showUploadImage={formLogic.showUploadImage}
               announcementTitle={formLogic.announcementTitle}
               textareaRef={formLogic.textareaRef}
               onInput={formLogic.handleInput}
               onTitleChange={formLogic.setAnnouncementTitle}
               onColorSelect={formLogic.handleInputBg}
               onResetStyles={formLogic.resetStyles}
               onLoadImage={formLogic.handleLoadingImage}
               onImageUpload={formLogic.handleImageUpload}
               onImageRemove={formLogic.handleImageRemove}
               onSetUser={formLogic.handleSetUser}
               onSetCalendar={formLogic.handleSetCalendar}
               onSetIdCard={formLogic.handleSetIdCard}
            />

            {/* Affichage des erreurs */}
            {error && (
               <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
               </div>
            )}

            {/* Bouton de soumission */}
            <div className="flex justify-center items-center mt-4">
               <button
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  type="button"
               >
                  {isSubmitting
                     ? "En cours..."
                     : isEditMode
                        ? "Mettre à jour"
                        : "Suivant"}
               </button>
            </div>
         </div>
      </Modal>
   );
}
