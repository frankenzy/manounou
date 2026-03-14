"use client";
import React, { useRef, useState } from "react";
import { MoreVertical, Edit, Share, Trash2 } from "lucide-react";
import { IPostDTO } from "@/models/Post";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import postsRepository from "@/repositories/postsRepository";

interface Props {
   postId?: string | number;
   onSetSelectedPost: (post: IPostDTO) => void;
   onOpenModal: () => void;
   openDeleteConfirmModal: (postId?: string | number) => void;
}

export default function PostMenu({ postId, onSetSelectedPost, onOpenModal, openDeleteConfirmModal }: Props) {
   const [isOpen, setIsOpen] = useState(false);
   const menuRef = useRef<HTMLDivElement | null>(null);
   useOnClickOutside(menuRef as React.RefObject<Node>, () => setIsOpen(false), isOpen);

   const handleEdit = async () => {
      setIsOpen(false);
      if (postId === undefined) return;

      try {
         const result = await postsRepository.getById(postId);
         if (result?.success) {
            onSetSelectedPost(result.data as IPostDTO);
            onOpenModal();
         }
      } catch (error) {
         console.error("Error fetching post for edit:", error);
      }
   };

   const handleDelete = () => {
      openDeleteConfirmModal(postId);
      setIsOpen(false);
   };

   const handleShare = async () => {
      setIsOpen(false);
      if (postId === undefined) return;

      try {
         const result = await postsRepository.getById(postId);
         if (result?.success) {
            onSetSelectedPost(result.data as IPostDTO);
            onOpenModal();
         }
      } catch (error) {
         console.error("Error fetching post for share:", error);
      }
   };

   return (
      <div className="relative" ref={menuRef}>
         <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors border border-transparent hover:border-gray-200"
            aria-label="Options"
         >
            <MoreVertical className="w-5 h-5 text-gray-600" />
         </button>

         {isOpen && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-1.5 z-50">
               <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
               >
                  <Edit className="w-4 h-4" />
                  Modifier
               </button>
               <button
                  onClick={handleShare}
                  className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
               >
                  <Share className="w-4 h-4" />
                  Partager
               </button>
               <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-sm text-red-600"
               >
                  <Trash2 className="w-4 h-4" />
                  Supprimer
               </button>
            </div>
         )}
      </div>
   );
}
