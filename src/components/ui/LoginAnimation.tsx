"use client"

import { useEffect, useState } from "react"
import { AnimatePresence } from "framer-motion"

import NounouAvatar from "./NounouAvatar"
import MessageBubble from "./MessageBubble"
import { messages } from "@/data/messages"

const avatars = [
   "/avatars/nounou1.png",
   "/avatars/nounou2.png",
   "/avatars/nounou3.png",
   "/avatars/nounou4.png"
]

export default function LoginAnimation() {

   const [people, setPeople] = useState<Array<{ id: number; avatar: string; message: string }>>([])

   useEffect(() => {

      const interval = setInterval(() => {

         const avatar =
            avatars[Math.floor(Math.random() * avatars.length)]

         const message =
            messages[Math.floor(Math.random() * messages.length)]

         setPeople(prev => {

            const newList = [
               ...prev,
               {
                  id: Math.random(),
                  avatar,
                  message
               }
            ]

            return newList.slice(-4)
         })

      }, 900)

      return () => clearInterval(interval)

   }, [])

   return (

      <div className="relative w-full h-[200px] flex items-center justify-center">

         <div className="flex flex-col gap-3">

            <AnimatePresence>

               {people.map(person => (

                  <div
                     key={person.id}
                     className="flex items-center gap-2"
                  >

                     <NounouAvatar avatar={person.avatar} />

                     <MessageBubble message={person.message} />

                  </div>

               ))}

            </AnimatePresence>

         </div>

      </div>
   )
}