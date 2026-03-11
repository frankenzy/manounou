"use client"

import { motion } from "framer-motion"

const messages = [
   { text: "Salut les filles 😂", align: "left" },
   { text: "Qui travaille à Cocody ?", align: "right" },
   { text: "Moi je suis à Marcory ❤️", align: "left" },
   { text: "On parle ce soir ?", align: "right" },
   { text: "Le bébé dort enfin 😅", align: "left" },
   { text: "Qui est libre ce soir ?", align: "right" },
   { text: "Le bébé m'a fatiguée aujourd'hui 😂", align: "left" }
]

export default function LoginAnimation() {
   return (
      <div className="w-full h-[220px] flex items-center justify-center overflow-hidden">

         <div className="flex flex-col gap-3 w-[320px]">

            {messages.map((msg, index) => (
               <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{
                     opacity: 1,
                     y: [10, 0, 10]
                  }}

                  transition={{
                     delay: index * 0.8,
                     duration: 3,
                     repeat: Infinity,
                     ease: "easeInOut"
                  }}
                  className={`px-4 py-2 rounded-2xl text-sm shadow-md max-w-[70%]
            ${msg.align === "right"
                        ? "ml-auto bg-green-500 text-white"
                        : "bg-white text-gray-800"
                     }`}
               >
                  {msg.text}
               </motion.div>
            ))}

         </div>

      </div>
   )
}