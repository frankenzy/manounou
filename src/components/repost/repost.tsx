import { RepostCreateRequest, RepostProps } from "@/models/Repost";
import Modal from "../Modal";
import { UserCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import useReposts from '@/hooks/useReposts';
import { toast } from "react-hot-toast";
import { useAuthContext } from "@/context/AuthContext";

export default function Repost({ post, isOpen, onClose, onSuccess }: RepostProps) {
   const postImage = typeof post.metadata?.image === "string" ? post.metadata.image : undefined;

   const handleCloseModal = () => {
      onClose();
   };
   const [repostText, setRepostText] = useState("");

   const [isSubmitting, setIsSubmitting] = useState(false);

   const { user, isLoggedIn } = useAuthContext();
   const authUserId = user?.id;


   const { createRepost } = useReposts(post.id as string);

   const handleRepostSubmit = async () => {
      setIsSubmitting(true);
      if (!authUserId) {
         toast.error("Vous devez être connecté pour republier.");
         setIsSubmitting(false);
         return;
      }

      try {
         const ok = await createRepost(post.id as string, authUserId, repostText);
         if (ok) {
            toast.success("Repost créé avec succès !");
            setRepostText("");
            onSuccess?.();
            handleCloseModal();
         } else {
            toast.error("Erreur lors de la création du repost");
         }
      } catch (error) {
         console.error("Erreur lors de la création du repost :", error);
         toast.error("Erreur lors de la création du repost : " + (error instanceof Error ? error.message : 'Erreur inconnue'));
      } finally {
         setIsSubmitting(false);
      }
   };

   console.log("Repost component received post:", post);
   return (
      <Modal isOpen={isOpen} onClose={handleCloseModal} className="my-modal" >
         <div className=" bg-white border-collapse rounded-lg p-4 gap-4 min-h-[395px] min-w-[600px] relative flex flex-col">
            <div className="flex flex-row justify-between items-center w-full relative bottom-0 collapsese border-b border-gray-300 pb-4">
               <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-md px-2 py-1 text-sm font-semibold text-gray-400 hover:text-red-500"
                  aria-label="Close modal"
               >
                  Annuler
               </button>
               <button
                  type="button"
                  onClick={handleRepostSubmit}
                  disabled={isSubmitting}
                  className="bg-orange-600   rounded-lg px-2 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                  aria-label="Close modal"
               >
                  {isSubmitting ? "Publication..." : "republier"}
               </button>
            </div>

            <div className="flex flex-col gap-4 my-2 h-32">
               <div className="flex items-start justify-between gap-4 rounded-xl p-2 transition-shadow">
                  <div className="flex items-start gap-3 flex-1">
                     <UserCircle
                        size={40}
                        className="text-orange-500 flex-shrink-0 mt-1"
                     />
                     <div className="flex flex-col gap-2 flex-1 min-w-0">
                        <span className="font-bold text-gray-900 text-base">{post.userId || "Anonyme"}</span>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 break-words">{post.description}</p>
                     </div>
                  </div>
                  <>
                     {postImage && (
                        <Image
                           src={postImage}
                           alt="Annonce image"
                           className="w-24 h-24 object-cover rounded-xl flex-shrink-0 shadow-sm"
                        />
                     )}</>
               </div>
            </div>
            <hr />
            <div className="flex flex-wrap gap-4 mt-2">
               <textarea
                  onChange={(e) => setRepostText(e.target.value)}
                  value={repostText}
                  placeholder="Texte à votre repost (optionnel)"
                  className="w-full focus:outline-none text-black focus:border-blue-500 p-2 bg-white transition"
                  rows={3}
               />
            </div>
         </div>

      </Modal>
   );
}