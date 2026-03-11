import { IPostDTO } from "@/models/Post";
import { useState } from "react";
import { HeartIcon, UserCircle } from "lucide-react";
import { useComments } from "@/hooks/useComments";
import AnnounceSkeleton from "../Post/AnnounceSkeleton";
import { CommentTime } from "./CommentTime";

interface CommentProps {
   annonce: IPostDTO;
   isOpen: boolean;
   onClose: () => void;
}

export default function Comment({ annonce }: CommentProps) {
   const [comment, setComment] = useState("");
   const { comments, isLoading, error, addComment } = useComments(annonce?.id);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async () => {
      if (!comment.trim()) return;

      setIsSubmitting(true);
      const success = await addComment(comment, "1");

      if (success) {
         setComment("");
      }

      setIsSubmitting(false);
   };

   return (
      <div className="space-y-4 p-8 gap-4 bg-neutral-100 block rounded-lg">
         <div className="flex items-center gap-4">
            <input
               type="text"
               placeholder="Add a comment..."
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
               disabled={isSubmitting}
               className="w-full focus:outline-none text-black focus:border-blue-500 p-2 bg-white rounded-lg border border-gray-300 transition"
            />

            <button
               onClick={handleSubmit}
               disabled={isSubmitting || !comment.trim()}
               className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white font-semibold p-2 rounded-lg transition"
            >
               {isSubmitting ? "Envoi..." : "Terminer"}
            </button>
         </div>



         <div className="block max-h-96 overflow-y-auto bg-neutral-100">
            {isLoading ? (
               <AnnounceSkeleton />
            ) : error ? (
               <p className="text-red-500 text-center">{error}</p>
            ) : comments.length === 0 ? (
               <p className="text-gray-500 text-center">Aucun commentaire pour le moment</p>
            ) : (
               comments.map((c) => (
                  <div key={c.id} className="mb-4 p-3 rounded-lg flex justify-normal items-start gap-3">
                     <UserCircle size={24} className="text-red-500 mt-1" />
                     <div className="flex-col justify-normal items-center">
                        <span className="text-sm font-semibold text-gray-800">Utilisateur {c.author_id}</span>
                        <p className="text-gray-600 mt-1">{c.comment}</p>
                     </div>


                     <div className="flex-col justify-end items-center ml-auto">
                        <CommentTime date={c.create_at} />
                        <div className="flex justify-normal item">
                           <HeartIcon size={16} className="text-gray-400 mt-1 ml-auto cursor-pointer" />
                           <span className="text-xs text-gray-400 ml-auto mt-1">22</span>
                        </div>
                     </div>
                  </div>
               ))
            )}
         </div>
      </div>
   );
}