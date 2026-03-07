"use client";

import { motion } from "framer-motion";
import { type PropsWithChildren } from "react";

interface StaggerListProps extends PropsWithChildren {
   className?: string;
   delayChildren?: number;
   staggerChildren?: number;
}

export function StaggerList({
   children,
   className,
   delayChildren = 0,
   staggerChildren = 0.08,
}: StaggerListProps) {
   return (
      <motion.div
         className={className}
         initial="hidden"
         animate="visible"
         variants={{
            hidden: {},
            visible: {
               transition: {
                  delayChildren,
                  staggerChildren,
               },
            },
         }}
      >
         {children}
      </motion.div>
   );
}

export function StaggerItem({ children, className }: PropsWithChildren<{ className?: string }>) {
   return (
      <motion.div
         className={className}
         variants={{
            hidden: { opacity: 0, y: 14 },
            visible: {
               opacity: 1,
               y: 0,
               transition: {
                  duration: 0.35,
                  ease: "easeOut",
               },
            },
         }}
      >
         {children}
      </motion.div>
   );
}
