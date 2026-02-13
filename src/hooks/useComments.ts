import { ICommentDTO } from "@/models/Comment";
import { useState, useEffect, useCallback } from "react";

interface UseCommentsResult {
   comments: ICommentDTO[];
   isLoading: boolean;
   error: string | null;
   refetch: () => Promise<void>;
   addComment: (comment: string, authorId: string) => Promise<boolean>;
   deleteComment: (commentId: number) => Promise<boolean>;
   updateComment: (commentId: number, newContent: string) => Promise<boolean>;
   countComments: () => Promise<number>;
}

export function useComments(announceId: number | undefined): UseCommentsResult {
   const [comments, setComments] = useState<ICommentDTO[]>([]);
   const [isLoading, setIsLoading] = useState(false);
   const [error, setError] = useState<string | null>(null);

   const fetchComments = useCallback(async () => {
      if (!announceId) return;

      setIsLoading(true);
      setError(null);

      try {
         const response = await fetch(`/api/comments?announce_id=${announceId}`);

         if (!response.ok) {
            throw new Error(`Failed to fetch comments: ${response.statusText}`);
         }

         const data = await response.json();

         if (data.success && Array.isArray(data.data)) {
            setComments(data.data);
         } else {
            throw new Error("Invalid response format");
         }
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "An error occurred";
         setError(errorMessage);
         console.error("Error fetching comments:", err);
      } finally {
         setIsLoading(false);
      }
   }, [announceId]);

   const addComment = useCallback(async (comment: string, authorId: string): Promise<boolean> => {
      if (!announceId || !comment.trim()) return false;

      try {
         const response = await fetch("/api/comments", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({
               announce_id: announceId,
               author_id: authorId,
               comment: comment.trim()
            })
         });

         if (!response.ok) {
            throw new Error(`Failed to add comment: ${response.statusText}`);
         }

         await fetchComments();
         return true;
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Failed to add comment";
         setError(errorMessage);
         console.error("Error adding comment:", err);
         return false;
      }
   }, [announceId, fetchComments]);

   const deleteComment = useCallback(async (commentId: number): Promise<boolean> => {
      try {
         const response = await fetch(`/api/comments/${commentId}`, {
            method: "DELETE"
         });

         if (!response.ok) {
            throw new Error(`Failed to delete comment: ${response.statusText}`);
         }

         await fetchComments();
         return true;
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Failed to delete comment";
         setError(errorMessage);
         console.error("Error deleting comment:", err);
         return false;
      }
   }, [fetchComments]);


   const updateComment = useCallback(async (commentId: number, newContent: string): Promise<boolean> => {
      if (!newContent.trim()) return false;

      try {
         const response = await fetch(`/api/comments/${commentId}`, {
            method: "PUT",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ comment: newContent.trim() })
         });

         if (!response.ok) {
            throw new Error(`Failed to update comment: ${response.statusText}`);
         }

         await fetchComments();
         return true;
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "Failed to update comment";
         setError(errorMessage);
         console.error("Error updating comment:", err);
         return false;
      }
   }, [fetchComments]);



   // count comments for the current announcement
   const countComments = useCallback(async (): Promise<number> => {
      if (!announceId) return 0;

      try {
         const response = await fetch(`/api/comments/count?announce_id=${announceId}`);

         if (!response.ok) {
            throw new Error(`Failed to count comments: ${response.statusText}`);
         }

         const data = await response.json();

         if (data.success && typeof data.data === "number") {
            return data.data;
         } else {
            throw new Error("Invalid response format");
         }
      } catch (err) {
         const errorMessage = err instanceof Error ? err.message : "An error occurred while counting comments";
         setError(errorMessage);
         console.error("Error counting comments:", err);
         return 0;
      }
   }, [announceId]);

   useEffect(() => {
      fetchComments();
   }, [announceId]);

   return {
      comments,
      isLoading,
      error,
      refetch: fetchComments,
      addComment,
      deleteComment,
      updateComment,
      countComments
   };
}
