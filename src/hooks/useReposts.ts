import postsRepository from '@/repositories/postsRepository';
import { useCallback, useEffect, useState } from 'react';

type NormalizedRepost = {
  id?: number | string;
  postId?: string;
  userId?: string;
  content?: string | null;
  createdAt?: string | Date;
  // keep original fields just in case
  announce_id?: any;
  author_id?: any;
  text?: any;
  created_at?: any;
};

interface UseRepostsResult {
  reposts: NormalizedRepost[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createRepost: (postId: string, userId: string, text?: string) => Promise<boolean>;
  deleteRepost: (postId: string | number) => Promise<boolean>;
  countReposts: () => Promise<number>;
}

export function useReposts(postId: string | number | undefined): UseRepostsResult {
  const [reposts, setReposts] = useState<NormalizedRepost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReposts = useCallback(async () => {
    if (postId === undefined || postId === null || postId === '') return;

    setIsLoading(true);
    setError(null);

    try {
      const q = encodeURIComponent(String(postId));
      const response = await fetch(`/api/repost?postId=${q}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch reposts: ${response.statusText}`);
      }

      const data = await response.json();

      const list: any[] =
        data && Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];

      const normalized = list.map(item => {
        return {
          id: item.id ?? item.repostId ?? undefined,
          postId:
            item.postId ??
            item.announce_id ??
            item.postId ??
            item.post_id ??
            String(item.postId ?? item.announce_id ?? item.postId ?? ''),
          userId:
            item.userId ??
            item.author_id ??
            item.authorId ??
            item.user_id ??
            item.author ??
            undefined,
          content: item.content ?? item.text ?? null,
          createdAt: item.createdAt ?? item.created_at ?? item.createdAt ?? undefined,
          announce_id: item.announce_id,
          author_id: item.author_id,
          text: item.text,
          created_at: item.created_at,
        } as NormalizedRepost;
      });

      setReposts(normalized);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      console.error('Error fetching reposts:', err);
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  const createRepost = useCallback(
    async (postId: string, userId: string, text?: string): Promise<boolean> => {
      if (!postId || !userId) return false;

      try {
        const request = { postId, userId, text };
        const data = await postsRepository.createRepost(request);
        if (data?.success) {
          await fetchReposts();
          return true;
        }
        const message = data?.message || 'Failed to create repost';
        setError(message);
        return false;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to create repost';
        setError(errorMessage);
        console.error('Error creating repost:', err);
        return false;
      }
    },
    [fetchReposts]
  );

  const deleteRepost = useCallback(
    async (postIdToDelete: string | number): Promise<boolean> => {
      try {
        const response = await fetch(`/api/repost`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ postId: String(postIdToDelete) }),
        });

        if (!response.ok) {
          throw new Error(`Failed to delete repost: ${response.statusText}`);
        }

        await fetchReposts();
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to delete repost';
        setError(errorMessage);
        console.error('Error deleting repost:', err);
        return false;
      }
    },
    [fetchReposts]
  );

  const countReposts = useCallback(async (): Promise<number> => {
    if (postId === undefined || postId === null || postId === '') return 0;

    try {
      // Reuse fetch endpoint and count locally if no dedicated count endpoint exists
      const q = encodeURIComponent(String(postId));
      const response = await fetch(`/api/repost?postId=${q}`);

      if (!response.ok) {
        throw new Error(`Failed to count reposts: ${response.statusText}`);
      }

      const data = await response.json();
      const list = data && Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      return list.length;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while counting reposts';
      setError(errorMessage);
      console.error('Error counting reposts:', err);
      return 0;
    }
  }, [postId]);

  useEffect(() => {
    fetchReposts();
  }, [postId, fetchReposts]);

  return {
    reposts,
    isLoading,
    error,
    refetch: fetchReposts,
    createRepost,
    deleteRepost,
    countReposts,
  };
}

export default useReposts;
