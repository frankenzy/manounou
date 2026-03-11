"use client"

import { motion } from "framer-motion"

export default function ChatBubble() {
   return (
      <motion.div
         className="absolute top-2 left-[120px] bg-white px-4 py-2 rounded-xl shadow text-sm"
         initial={{ opacity: 0, scale: 0 }}
         animate={{ opacity: 1, scale: 1 }}
         transition={{
            delay: 2,
            duration: 0.6
         }}
      >
         Salut les filles 😂
      </motion.div>
   )
}