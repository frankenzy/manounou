"use client";

import { faClose } from "@fortawesome/free-solid-svg-icons/faClose";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { toast } from 'react-hot-toast';
import PostForm from "./PostCreateForm";
import { PostModalProps } from "./types";
import { usePostForm } from "./usePostForm";
import { usePostSubmit } from "./usePostSubmit";
import ModalV2 from "../modals/Modal_V2";
import { AnimatePresence, motion } from "framer-motion";
import { slideHorizontal, springs } from "../motion";

export default function PostModal({
   isOpen,
   onClose,
   onSuccess,
   post,
   mode,
}: PostModalProps) {
   const isEditMode = mode === "edit" || !!post;

   const [openSession, setOpenSession] = useState(0);
   const formLogic = usePostForm(post, isOpen);

   const { isSubmitting, error, createPost, updatePost } = usePostSubmit();


   useEffect(() => {
      if (!isOpen) {
         formLogic.resetForm();
      }
   }, [isOpen, formLogic.resetForm]);

   useEffect(() => {
      if (isOpen) {
         setOpenSession((prev) => prev + 1);
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
         result = await updatePost(post?.id, formData, post);
      } else {
         result = await createPost(formData);
      }
      if (result && result.success !== false && !result.error) {
         handleCloseModal();
         if (onSuccess) onSuccess();
      } else {
         toast.error(result?.error || 'Erreur lors de la soumission de l\'annonce');
      }
   };


   const tabsContainerRef = useRef<HTMLDivElement | null>(null);
   const btnJobRef = useRef<HTMLButtonElement | null>(null);
   const btnEmpRef = useRef<HTMLButtonElement | null>(null);
   const [tabs, setTabs] = useState<'job-seeker' | 'employer'>('job-seeker');
   useEffect(() => {
      const update = () => {
         const container = tabsContainerRef.current;
         const activeBtn = tabs === "job-seeker" ? btnJobRef.current : btnEmpRef.current;
         if (container && activeBtn) {
            const containerRect = container.getBoundingClientRect();
            const activeRect = activeBtn.getBoundingClientRect();
            const left = activeRect.left - containerRect.left;
            const width = activeRect.width;
            container.style.setProperty("--underline-left", `${left}px`);
            container.style.setProperty("--underline-width", `${width}px`);
         }
      };
      update();
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
   }, [tabs]);


   return (
      <ModalV2 isOpen={isOpen} onClose={handleCloseModal} className="my-modal">
         <div className="p-6" key={`post-modal-session-${openSession}`}>
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
               <div className="flex rounded-md">



                  <button
                     className={`flex-1 py-4 text-center font-semibold transition-colors duration-100 ${tabs === "job-seeker" ? "text-orange-600 shadow-sm rounded-lg bg-white" : "text-gray-600 hover:bg-gray-50"}`}
                     onClick={() => setTabs("job-seeker")}
                     aria-pressed={tabs === "job-seeker"}
                  >
                     Je cherche un travail
                  </button>

                  <button

                     className={`flex-1 py-4 text-center font-semibold transition-colors duration-100 ${tabs === "employer" ? "text-orange-600 shadow-sm rounded-lg bg-white" : "text-gray-600 hover:bg-gray-50"}`}
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
            {/* <hr className="mb-4" /> */}


            <AnimatePresence mode="wait">
               <motion.div
                  key={tabs}
                  {...slideHorizontal(tabs === "job-seeker" ? 1 : -1)}
               >
                  <PostForm
                     inputValue={formLogic.inputValue}
                     inputBg={formLogic.inputBg}
                     inputColor={formLogic.inputColor}
                     showUploadImage={formLogic.showUploadImage}
                     postTitle={formLogic.postTitle}
                     image={formLogic.image}
                     textareaRef={formLogic.textareaRef}
                     onInput={formLogic.handleInput}
                     onTitleChange={formLogic.setPostTitle}
                     onColorSelect={formLogic.handleInputBg}
                     onResetStyles={formLogic.resetStyles}
                     onLoadImage={formLogic.handleLoadingImage}
                     onImageUpload={formLogic.handleImageUpload}
                     onImageRemove={formLogic.handleImageRemove}
                     onSetUser={formLogic.handleSetUser}
                     onSetCalendar={formLogic.handleSetCalendar}
                     onSetIdCard={formLogic.handleSetIdCard}
                  />

               </motion.div>
            </AnimatePresence>

            {error && (
               <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
               </div>
            )}

            <div className="flex justify-center items-center mt-4">
               <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springs.soft}
                  className="mt-2 px-4 py-2 bg-orange-500 text-white rounded w-full"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
               >
                  {isSubmitting ? "En cours..." : "Suivant"}
               </motion.button>
            </div>
         </div>
      </ModalV2>
   );
}
