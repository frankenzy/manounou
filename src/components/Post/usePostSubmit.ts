import { IPostDTO } from "@/models/Post";
import { useState } from "react";
import { PostFormData } from "./types";
import postsRepository from "@/repositories/postsRepository";

export const usePostSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAuthenticatedUserId = async (): Promise<string> => {
    const meResponse = await fetch("/api/auth/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const meResult = await meResponse.json();

    if (!meResponse.ok || !meResult?.success || !meResult?.data?.id) {
      throw new Error("Utilisateur non connecté");
    }

    return String(meResult.data.id);
  };

  const createPost = async (formData: PostFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const authenticatedUserId = await getAuthenticatedUserId();

      const result = await postsRepository.createPost({
        authorId: authenticatedUserId,
        content: formData.description,
        metaData: formData.metadata,
        visibility: formData.metadata?.visibility || "PUBLIC",
        title: formData.title,
        location: formData.location,
        parent_id: formData.parent_id ?? null,
      });

      if (result?.success) {
        console.log("Annonce créée avec succès:", result.data);
        return { success: true, data: result.data };
      } else {
        const errorMessage = `Erreur: ${result?.message || 'Unknown error'}`;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Une erreur est survenue lors de la création de l'annonce";
      setError(errorMessage);
      console.error("Erreur lors de la création:", err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePost = async (
    postId: number | string | undefined,
    formData: PostFormData,
    originalPost?: IPostDTO
  ) => {
    if (!postId) {
      const errorMessage = "ID de l'annonce manquant";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const authenticatedUserId = await getAuthenticatedUserId();

      const result = await postsRepository.updatePost(postId, {
        authorId: originalPost?.userId || authenticatedUserId,
        content: formData.description,
        metaData: formData.metadata,
        visibility: formData.metadata?.visibility || "PUBLIC",
        title: formData.title,
        location: formData.location || originalPost?.location || "Non spécifié",
        parent_id: formData.parent_id ?? originalPost?.parent_id ?? null,
      });

      if (result?.success) {
        console.log("Annonce modifiée avec succès:", result.data);
        return { success: true, data: result.data };
      } else {
        const errorMessage = `Erreur: ${result?.message || 'Unknown error'}`;
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    } catch (err) {
      const errorMessage = "Une erreur est survenue lors de la modification de l'annonce";
      setError(errorMessage);
      console.error("Erreur lors de la modification:", err);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    error,
    createPost,
    updatePost,
  };
};
