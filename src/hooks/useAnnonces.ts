import useSWR from "swr";
import { FeedPost } from "@/types/feed";
import postsRepository from "@/repositories/postsRepository";

export function useAnnonces() {
   const { data, error, isLoading, mutate } = useSWR<FeedPost[]>("/api/annonces", postsRepository.getFeed, { revalidateOnFocus: false });

   const annonces = data ?? [];
   const loading = Boolean(isLoading);

   const fetchAnnonces = async () => mutate();
   const setAnnonces = (value: FeedPost[] | ((curr: FeedPost[] | undefined) => FeedPost[])) => mutate(value as any, false);

   return { annonces, loading, error: (error as Error) || null, fetchAnnonces, setAnnonces } as const;
}

export default useAnnonces;
