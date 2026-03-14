import { motion, AnimatePresence } from "framer-motion";
import { scaleIn } from "../motion";

interface CustomProps {
   children: React.ReactNode;
   className?: string;
   isOpen?: boolean;
   onClose?: () => void;
}

export default function ModalV2({ isOpen, onClose, children }: CustomProps) {
   return (
      <AnimatePresence>
         {isOpen && (
            <motion.div
               className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={onClose}
            >
               <motion.div
                  {...scaleIn}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl shadow-xl max-w-2xl w-full"
                  onClick={(event) => event.stopPropagation()}
               >
                  {children}
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
   );
}