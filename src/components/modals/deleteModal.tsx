import { Trash2 } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, onConfirm, isDeletingPost }: { isOpen: boolean; onClose: () => void; onConfirm: () => void; isDeletingPost: boolean }) => {
   return (

      <>
         <div
            className={`fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-200 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-post-title"
            aria-describedby="delete-post-description"
         >
            <button
               type="button"
               aria-label="Fermer la confirmation"
               disabled={isDeletingPost}
               onClick={onClose}
               className={`absolute inset-0 bg-black/35 backdrop-blur-sm transition-opacity duration-200 ${isOpen ? "opacity-100" : "opacity-0"}`}
            />

            <div
               className={`relative w-full max-w-sm rounded-3xl border border-white/40 bg-white/85 p-5 shadow-2xl backdrop-blur-xl transition-all duration-300 ease-out ${isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-95 opacity-0"}`}
            >
               <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <Trash2 className="h-6 w-6" />
               </div>

               <h3 id="delete-post-title" className="text-center text-lg font-semibold text-gray-900">
                  Supprimer cette annonce ?
               </h3>
               <p id="delete-post-description" className="mt-2 text-center text-sm text-gray-600">
                  Cette action est définitive et ne peut pas être annulée.
               </p>

               <div className="mt-5 flex gap-4 justify-between items-center w-full">
                  <button
                     type="button"
                     onClick={onClose}
                     disabled={isDeletingPost}
                     className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                     Annuler
                  </button>
                  <button
                     type="button"
                     onClick={onConfirm}
                     disabled={isDeletingPost}
                     className="flex-1 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                     {isDeletingPost ? "Suppression..." : "Supprimer"}
                  </button>
               </div>
            </div>
         </div>
      </>
   );
}

export default DeleteModal;