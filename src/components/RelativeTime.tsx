import { useRelativeTime } from "@/hooks/useRelativeTime";

interface RelativeTimeProps {
   date: Date | string | number;
}

/**
 * Composant pour afficher un temps relatif côté client
 * Rend vide côté serveur, puis le temps relatif après hydration
 */
export function RelativeTime({ date }: RelativeTimeProps) {
   const relativeTime = useRelativeTime(date);
   
   return (
      <span suppressHydrationWarning>
         {relativeTime}
      </span>
   );
}
