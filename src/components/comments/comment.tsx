import { Announcement, IAnnouncementDTO } from "@/models/Annnouncements";
import Modal from "../Modal";
import { useState, useEffect, useMemo } from "react";
import { Icon, UserIcon } from "lucide-react";
import { Interface } from "readline";
import { on } from "events";

interface CommentProps {
   annonce: IAnnouncementDTO;
   isOpen: boolean;
   onClose: () => void;
}


interface IComment {
   announce_id: string;
   author_id: string;
   comment: string;
}

interface IcommentProps {
   annonce: IAnnouncementDTO;
   comment: string
}



export default function Comment({ annonce, isOpen, onClose }: CommentProps) {

   const [comment, setComment] = useState("");
   const [comments, setComments] = useState<IComment[]>([]);
   const [isSubmitting, setIsSubmitting] = useState(false);

   const fetchComments = async () => {
      try {
         const response = await fetch(`/api/comments`);
         if (response.ok) {
            const data = await response.json();
            console.log("response comments data:", data);
            setComments(data.data);
         } else {
            console.error("Failed to fetch comments:", await response.text());
         }
      } catch (error) {
         console.error("Error fetching comments:", error);
      }
   };

   useEffect(() => {
      if (isOpen) {
         fetchComments();
      }
   }, [annonce]);

   const filteredComments = useMemo(() => {
      comments.forEach(c => {
         console.log(`Comment ID ${c.announce_id}: announce_id = ${c.announce_id} (type: ${typeof c.announce_id})`);
         console.log(`Comparing with: ${String(annonce?.id)} (type: ${typeof String(annonce?.id)})`);
         console.log(`Match? ${c.announce_id === String(annonce?.id)}`);
      });
      return comments.filter(comment => String(comment.announce_id) === String(annonce?.id));
   }, [comments, annonce?.id]);





   const handleSubmit = async () => {
      if (!comment.trim()) return;

      setIsSubmitting(true);
      try {
         let data = {
            announce_id: String(annonce.id),
            author_id: "1", // TODO: Récupérer l'ID de l'utilisateur connecté
            comment: comment
         }
         const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
         });

         if (response.ok) {
            setComment("");
            await fetchComments(); // Refresh comments list
            console.log("Commentaire enregistré avec succès");
         } else {
            console.error("Erreur:", await response.text());
         }
      } catch (error) {
         console.error("Erreur lors de l'envoi du commentaire:", error);
      } finally {
         setIsSubmitting(false);
      }
   };

   return (
      <Modal isOpen={isOpen} onClose={onClose}>
         <div className="space-y-4 p-8 gap-4 bg-neutral-100 block rounded-lg">
            <div className="flex justify-between items-center">
               <div className="rounded-full bg-slate-200">
                  <UserIcon name="comments" size={24} className="text-gray-600 m-2" />
               </div>
               <div className="flex items-center space-x-2">
                  <p className="">
                     Commentaires:
                  </p>
                  <span className="font-semibold text-sm p-2 rounded-full">{filteredComments.length}</span>
               </div>
            </div>
            <div className="p-4 block  max-h-96 overflow-y-auto bg-neutral-100">
               <p className="text-gray-800">{annonce.description}</p>
            </div>

            <div className="p-4 block  max-h-96 overflow-y-auto bg-neutral-100">
               {filteredComments.length === 0 ? (
                  <p className="text-gray-500 text-center">Aucun commentaire pour le moment</p>
               ) : (
                  filteredComments.map((c, index) => (
                     <div key={index} className="mb-4 p-3 bg-white rounded-lg">
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
                  {isSubmitting ? "commentaitre..." : "Commenter"}
               </button>
            </div>
         </div>
      </Modal>
   );
}