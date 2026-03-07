"use client";

import { motion, type MotionProps } from "framer-motion";
import { type PropsWithChildren } from "react";

interface AnimatedRevealProps extends PropsWithChildren {
   delay?: number;
   y?: number;
   className?: string;
   once?: boolean;
   amount?: number;
}

export function AnimatedReveal({
   children,
   delay = 0,
   y = 18,
   className,
   once = true,
   amount = 0.2,
}: AnimatedRevealProps) {
   const motionProps: MotionProps = {
      initial: { opacity: 0, y },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once, amount },
      transition: { duration: 0.45, ease: "easeOut", delay },
   };

   return (
      <motion.div className={className} {...motionProps}>
         {children}
      </motion.div>
   );
}
