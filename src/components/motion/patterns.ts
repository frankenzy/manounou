import { durations, distances, scales } from "./tokens";
import { easings } from "./easings";

export const fadeIn = {
   initial: { opacity: 0 },
   animate: {
      opacity: 1,
      transition: {
         duration: durations.normal,
         ease: easings.standard,
      },
   },
};

export const slideUp = {
   initial: { opacity: 0, y: distances.md },
   animate: {
      opacity: 1,
      y: 0,
      transition: {
         duration: durations.normal,
         ease: easings.standard,
      },
   },
};

export const scaleIn = {
   initial: {
      opacity: 0,
      scale: scales.soft,
   },
   animate: {
      opacity: 1,
      scale: 1,
      transition: {
         duration: durations.slow,
         ease: easings.entrance,
      },
   },
};

export const slideHorizontal = (direction: 1 | -1) => ({
   initial: {
      opacity: 0,
      x: direction * distances.lg,
   },
   animate: {
      opacity: 1,
      x: 0,
      transition: {
         duration: durations.normal,
         ease: easings.standard,
      },
   },
   exit: {
      opacity: 0,
      x: direction * -distances.lg,
      transition: {
         duration: durations.fast,
         ease: easings.exit,
      },
   },
});