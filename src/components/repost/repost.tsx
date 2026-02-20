import { RepostApiResponse, RepostCreateRequest, RepostProps } from "@/models/Repost";
import Modal from "../Modal";
import { UserCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";

export default function Repost({ annonce, isOpen, onClose, onSuccess }: RepostProps) {
   const announcementImage = typeof annonce.metadata?.image === "string" ? annonce.metadata.image : undefined;

   const handleCloseModal = () => {
      onClose();
   };
   const [repostText, setRepostText] = useState("");

   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleRepostSubmit = async () => {

      setIsSubmitting(true);
      const requestData: RepostCreateRequest = {
         announceId: annonce.id as number,
         authorId: 1,
         text: repostText,
      };

      try {
         const response = await fetch("/api/repost", {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify(requestData),
         });

         const data: RepostApiResponse = await response.json();

         if (response.ok) {
            alert("Repost créé avec succès !");
            setRepostText("");
            onSuccess?.();
            handleCloseModal();

         } else {

            alert(`Erreur lors de la création du repost : ${data.message || 'Erreur inconnue'}`);

         }


      } catch (error) {

         console.error("Erreur lors de la création du repost :", error);

         alert("Erreur lors de la création du repost : " + (error instanceof Error ? error.message : 'Erreur inconnue'));

      } finally {

         setIsSubmitting(false);

      }
   };

   console.log("Repost component received annonce:", annonce);
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
                        <span className="font-bold text-gray-900 text-base">{annonce.user_id || "Anonyme"}</span>
                        <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 break-words">{annonce.description}</p>
                     </div>
                  </div>
                  <>
                     {announcementImage && (
                        <Image
                           src={announcementImage}
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