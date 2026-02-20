import { useRelativeTime } from "@/hooks/useRelativeTime";

interface CommentTimeProps {
   date: Date | string | number;
}
export function CommentTime({ date }: CommentTimeProps) {
   const relativeTime = useRelativeTime(date);

   return (
      <div className="text-xs text-gray-400 ml-auto mt-1" suppressHydrationWarning>
         {relativeTime}
      </div>
   );
}
