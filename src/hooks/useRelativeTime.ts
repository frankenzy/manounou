import { useEffect, useState } from "react";
import { GetCreatedAt } from "@/utils/getCreatedAt";
export function useRelativeTime(date: Date | string | number): string {
   const [relativeTime, setRelativeTime] = useState("");

   useEffect(() => {
          setRelativeTime(GetCreatedAt(date, new Date()));
      
      const interval = setInterval(() => {
         setRelativeTime(GetCreatedAt(date, new Date()));
      }, 60000);

      return () => clearInterval(interval);
   }, [date]);
   return relativeTime;
}
