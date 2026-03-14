import { useEffect, useState, useCallback } from "react";

type UserPayload = { id?: string;[key: string]: any } | null;

export function useAuth() {
   const [user, setUser] = useState<UserPayload>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<Error | null>(null);

   const fetchMe = useCallback(async () => {
      setLoading(true);
      setError(null);
      try {
         const res = await fetch("/api/auth/me", { method: "GET", headers: { "Content-Type": "application/json" } });
         if (!res.ok) {
            setUser(null);
            const payload = await res.json().catch(() => null);
            throw new Error(payload?.message || `HTTP ${res.status}`);
         }
         const data = await res.json().catch(() => null);
         setUser(data?.data ?? null);
         return data?.data ?? null;
      } catch (err) {
         setUser(null);
         setError(err as Error);
         return null;
      } finally {
         setLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchMe();
   }, [fetchMe]);

   const refresh = useCallback(() => fetchMe(), [fetchMe]);

   const isLoggedIn = Boolean(user);

   return { user, isLoggedIn, loading, error, refresh } as const;
}

export default useAuth;
