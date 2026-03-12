import { IPostDTO } from "@/models/Post";
import { useState } from "react";
import { PostFormData } from "./types";

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

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: authenticatedUserId,
          title: formData.title,
          description: formData.description,
          parent_id: formData.parent_id ?? null,
          location: formData.location,
          metadata: formData.metadata,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Annonce créée avec succès:", result.data);
        return { success: true, data: result.data };
      } else {
        const errorMessage = `Erreur: ${result.message}`;
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

      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: originalPost?.user_id || authenticatedUserId,
          title: formData.title,
          description: formData.description,
          parent_id: formData.parent_id ?? originalPost?.parent_id ?? null,
          location: formData.location || originalPost?.location || "Non spécifié",
          metadata: formData.metadata,
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log("Annonce modifiée avec succès:", result.data);
        return { success: true, data: result.data };
      } else {
        const errorMessage = `Erreur: ${result.message}`;
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
