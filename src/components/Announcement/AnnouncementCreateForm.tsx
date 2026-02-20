"use client";

import UploadImage, { UploadImageRef, UploadedImageData } from "@/components/uploadImage";
import {
   faCalendar,
   faClock,
   faImage,
   faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";

interface AnnouncementCreateFormProps {
   // State
   inputValue: string;
   inputBg: string;
   inputColor: string;
   showUploadImage: boolean;
   announcementTitle: string;
   textareaRef: React.RefObject<HTMLTextAreaElement | null>;
   image?: UploadedImageData;

   // Handlers
   onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
   onTitleChange: (title: string) => void;
   onColorSelect: (color: string) => void;
   onResetStyles: () => void;
   onLoadImage: () => void;
   onImageUpload: (imageData: UploadedImageData) => void;
   onImageRemove: () => void;
   onSetUser: () => void;
   onSetCalendar: () => void;
   onSetIdCard: () => void;
}

export default function AnnouncementCreateForm({
   inputValue,
   inputBg,
   inputColor,
   showUploadImage,
   image,
   textareaRef,
   onInput,
   onColorSelect,
   onResetStyles,
   onLoadImage,
   onImageUpload,
   onImageRemove,
   onSetUser,
   onSetCalendar,
   onSetIdCard,
}: AnnouncementCreateFormProps) {
   const uploadImageRef = useRef<UploadImageRef>(null);

   const handleLoadImage = () => {
      onLoadImage();
      setTimeout(() => {
         uploadImageRef.current?.openFileDialog();
      }, 100);
   };

   return (
      <div>
         <div
            className={`modal modalForms row justify-normal items-center rounded-lg gap-4 my-8 ${inputBg}`}
         >
            <textarea
               ref={textareaRef}
               value={inputValue}
               placeholder="Décrire votre publication..."
               className={`flex flex-auto w-full p-2 rounded-lg focus:outline-none bg-inherit resize-none overflow-y-auto ${inputColor}`}
               style={{ minHeight: "60px", maxHeight: "180px" }}
               onChange={onInput}
            />

            {showUploadImage && (
               <div className="flex flex-auto items-center justify-start">
                  <UploadImage
                     ref={uploadImageRef}
                     onUpload={onImageUpload}
                     onRemove={onImageRemove}
                     initialImageUrl={image?.url}
                     initialPublicId={image?.publicId}
                  />
               </div>
            )}
         </div>

         <div className="flex-auto flex flex-row gap-4 text-[clamp(1rem,2vw,1.5rem)] justify-start items-start mb-4">
            <button
               className="w-5 bg-orange-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
               onClick={() => onColorSelect("bg-gradient-to-br from-orange-500 to-orange-600")}
               type="button"
            />
            <button
               className="w-5 bg-green-600 rounded-md h-6 p-2 text-white flex items-center justify-center"
               onClick={() => onColorSelect("bg-gradient-to-br from-green-600 to-emerald-700")}
               type="button"
            />
            <button
               className="w-5 bg-red-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
               onClick={() => onColorSelect("bg-gradient-to-br from-red-500 to-yellow-500")}
               type="button"
            />
            <button
               className="w-5 bg-yellow-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
               onClick={() => onColorSelect("bg-gradient-to-br from-amber-400 to-orange-500")}
               type="button"
            />
            <button
               className="w-5 bg-gray-500 rounded-md h-6 p-2 text-white flex items-center justify-center"
               onClick={() => onColorSelect("bg-gradient-to-br from-slate-600 to-slate-800")}
               type="button"
            />
            <button
               className="w-5 bg-white rounded-md h-6 p-2 text-white flex items-center justify-center border-2 border-black"
               onClick={onResetStyles}
               type="button"
            />
         </div>

         {/* Icônes */}
         <div className="icons flex flex-row text-[clamp(1.5rem,2vw,2.5rem)] justify-start items-start gap-12">
            <div className="flex justify-start items-start">
               <FontAwesomeIcon
                  icon={faImage}
                  onClick={handleLoadImage}
                  color="gray"
                  size="sm"
                  className="cursor-pointer"
               />
            </div>
            <div className="flex justify-start items-start">
               <FontAwesomeIcon
                  icon={faUser}
                  color="gray"
                  size="sm"
                  onClick={onSetUser}
                  className="cursor-pointer"
               />
            </div>
            <div className="flex justify-start items-start">
               <FontAwesomeIcon
                  icon={faCalendar}
                  color="gray"
                  size="sm"
                  onClick={onSetCalendar}
                  className="cursor-pointer"
               />
            </div>
            <div className="flex justify-start items-start">
               <FontAwesomeIcon
                  icon={faClock}
                  color="gray"
                  size="sm"
                  onClick={onSetIdCard}
                  className="cursor-pointer"
               />
            </div>
         </div>
      </div>
   );
}
