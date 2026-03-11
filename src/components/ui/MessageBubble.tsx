"use client"

import { motion } from "framer-motion"

interface MessageBubbleProps {
   message: string
}

export default function MessageBubble({ message }: MessageBubbleProps) {

   return (
      <motion.div
         className="bg-white px-3 py-2 rounded-xl shadow text-sm"
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         exit={{ opacity: 0 }}
         transition={{ duration: 0.4 }}
      >
         {message}
      </motion.div>
   )
}