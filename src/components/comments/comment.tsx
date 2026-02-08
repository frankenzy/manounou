import { IAnnouncementDTO } from "@/models/Annnouncements";
import Modal from "../Modal";
import { useState } from "react";
import { UserIcon } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import CommentSkeleton from "./AnnounceSkeleton";

interface CommentProps {
   annonce: IAnnouncementDTO;
   isOpen: boolean;
   onClose: () => void;
}

export default function Comment({ annonce, isOpen, onClose }: CommentProps) {
   const [comment, setComment] = useState("");
   const { comments, isLoading, error, addComment } = useComments(annonce?.id);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async () => {
      if (!comment.trim()) return;

      setIsSubmitting(true);
      const success = await addComment(comment, "1"); // TODO: Récupérer l'ID de l'utilisateur connecté

      if (success) {
         setComment("");
      }

      setIsSubmitting(false);
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="space-y-4 p-8 gap-4 bg-neutral-100 block rounded-lg">
            <div className="flex justify-between items-center">
               <div className="rounded-full bg-slate-200">
                  <UserIcon size={24} className="text-gray-600 m-2" />
               </div>
               <div className="flex items-center space-x-2">
                  <p className="">
                     Commentaires:
                  </p>
                  <span className="font-semibold text-sm p-2 rounded-full">{comments.length}</span>
               </div>
            </div>

            <div className="p-4 block max-h-96 overflow-y-auto bg-neutral-100">
               <p className="text-gray-800">{annonce.description}</p>
            </div>

            <div className="p-4 block max-h-96 overflow-y-auto bg-neutral-100">
               {isLoading ? (
                  <CommentSkeleton />
               ) : error ? (
                  <p className="text-red-500 text-center">{error}</p>
               ) : comments.length === 0 ? (
                  <p className="text-gray-500 text-center">Aucun commentaire pour le moment</p>
               ) : (
                  comments.map((c) => (
                     <div key={c.id} className="mb-4 p-3 bg-white rounded-lg">
                        <span className="font-semibold text-sm text-gray-600">User {c.author_id}:</span>
                        <p className="text-gray-800 mt-1">{c.comment}</p>
                     </div>
                  ))
               )}
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
                  className="w-full p-2 focus:outline-none text-black focus:border-blue-500 px-4 py-8 bg-white rounded-lg border border-gray-300 transition"
               />

               <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !comment.trim()}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold py-2 px-4 rounded-lg transition"
               >
                  {isSubmitting ? "Envoi..." : "Commenter"}
               </button>
            </div>
         </div>
      </Modal>
   );
}