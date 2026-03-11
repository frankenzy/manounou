"use client"

import { motion } from "framer-motion"
import ChatBubble from "./ChatBubble"

export default function WalkingNounou() {
   return (
      <div className="relative flex flex-col items-center justify-center h-[220px]">

         {/* Nounou walking */}
         <motion.svg
            width="120"
            height="120"
            viewBox="0 0 120 120"
            initial={{ x: -120 }}
            animate={{ x: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
         >

            {/* head */}
            <circle cx="60" cy="25" r="10" fill="#8B5A2B" />

            {/* body */}
            <rect x="50" y="35" width="20" height="35" fill="#FF6B6B" rx="6" />

            {/* phone */}
            <rect x="70" y="40" width="6" height="10" fill="#333" rx="2" />

            {/* left leg */}
            <motion.line
               x1="55"
               y1="70"
               x2="45"
               y2="95"
               stroke="#333"
               strokeWidth="4"
               animate={{ rotate: [10, -10, 10] }}
               transition={{ duration: 0.8, repeat: Infinity }}
            />

            {/* right leg */}
            <motion.line
               x1="65"
               y1="70"
               x2="75"
               y2="95"
               stroke="#333"
               strokeWidth="4"
               animate={{ rotate: [-10, 10, -10] }}
               transition={{ duration: 0.8, repeat: Infinity }}
            />

         </motion.svg>

         {/* chat bubble */}
         <ChatBubble />

      </div>
   )
}