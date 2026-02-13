import { useEffect, useState } from "react";
import { GetCreatedAt } from "@/utils/getCreatedAt";

/**
 * Hook pour transformer un timestamp en temps relatif côté client uniquement
 * Évite les mismatches d'hydration SSR/client
 */
export function useRelativeTime(date: Date | string | number): string {
   const [relativeTime, setRelativeTime] = useState("");
   const [isMounted, setIsMounted] = useState(false);

   useEffect(() => {
      setIsMounted(true);
      // Calculer le temps relatif uniquement côté client
      setRelativeTime(GetCreatedAt(date, new Date()));
      
      // Mettre à jour chaque minute pour garder la précision
      const interval = setInterval(() => {
         setRelativeTime(GetCreatedAt(date, new Date()));
      }, 60000);

      return () => clearInterval(interval);
   }, [date]);

   // Pendant le SSR, retourner une string vide (pas de mismatch)
   // Le client va remplir après l'hydration
   return relativeTime;
}
