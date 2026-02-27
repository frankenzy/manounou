import { durations } from "./tokens";

export const pulseOnce = {
   animate: {
      scale: [1, 1.04, 1],
   },
   transition: {
      duration: durations.slow,
   },
};

export const subtleGlow = {
   animate: {
      boxShadow: [
         "0 0 0px rgba(249,115,22,0)",
         "0 0 20px rgba(249,115,22,0.6)",
         "0 0 0px rgba(249,115,22,0)",
      ],
   },
   transition: {
      duration: 1.2,
   },
};