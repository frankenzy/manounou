import { Announcement, IAnnouncementDTO } from "@/models/Annnouncements";
import Modal from "../Modal";
import { useState, useEffect } from "react";
import { Icon, UserIcon } from "lucide-react";
import { Interface } from "readline";

interface CommentProps {
   annonce: IAnnouncementDTO;
   isOpen: boolean;
   onClose: () => void;
}


interface IcommentProps {
   annonce: IAnnouncementDTO;
   comment: string
}



export default function Comment({ annonce, isOpen, onClose }: CommentProps) {






   const [comment, setComment] = useState("");
   const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
      console.log("Annonce dans le commentaire:", annonce);
   }, [annonce]);

   const handleSubmit = async () => {
      if (!comment.trim()) return;

      setIsSubmitting(true);
      try {
         // TODO: Ajouter la logique d'envoi du commentaire
         let data = {
            annonceId: annonce.id,
            content: comment
         }
         console.log("Commentaire envoyé:", data);

         setComment("");
      } catch (error) {
         console.error("Erreur lors de l'envoi du commentaire:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="space-y-4 p-8 gap-4">
            <div className="flex justify-between items-center">
               <div className="rounded-full bg-slate-200">
                  <UserIcon name="comments" size={24} className="text-gray-600 m-2" />
               </div>
               <div className="flex items-center space-x-2">
                  <p className="">
                     Commentaires:
                  </p>
                  <span className="font-semibold text-sm p-2 bg-slate-200 rounded-full">10</span>
               </div>
            </div>
            <div className="p-4 block">
               <p className="text-gray-800">{annonce.description}</p>
            </div>

            <hr />

            <div className="space-y-2">
               <input
                  type="text"
                  placeholder="Add a comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
                  disabled={isSubmitting}
                  className="w-full p-2 focus:outline-none focus:border-blue-500 px-4 py-8 "
               />
               <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !comment.trim()}
                  className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
               >
                  {isSubmitting ? "commentaitre..." : "Commenter"}
               </button>
            </div>
         </div>
      </Modal>
   );
}