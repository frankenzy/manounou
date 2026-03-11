"use client"

import { motion } from "framer-motion"

interface NounouAvatarProps {
   avatar: string
}

export default function NounouAvatar({ avatar }: NounouAvatarProps) {

   return (
      <motion.img
         src={avatar}
         className="w-10 h-10 rounded-full shadow"
         initial={{ opacity: 0, scale: 0.7, y: 30 }}
         animate={{ opacity: 1, scale: 1, y: 0 }}
         exit={{ opacity: 0, scale: 0.7 }}
         transition={{ duration: 0.5 }}
      />
   )
}