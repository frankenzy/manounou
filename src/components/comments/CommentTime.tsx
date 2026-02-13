import { useRelativeTime } from "@/hooks/useRelativeTime";

interface CommentTimeProps {
   date: Date | string | number;
}

/**
 * Composant pour afficher la date d'un commentaire côté client
 * Rend vide côté serveur, puis la date après hydration
 */
export function CommentTime({ date }: CommentTimeProps) {
   const relativeTime = useRelativeTime(date);

   return (
      <div className="text-xs text-gray-400 ml-auto mt-1" suppressHydrationWarning>
         {relativeTime}
      </div>
   );
}
