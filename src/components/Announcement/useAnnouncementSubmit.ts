import { IAnnouncementDTO } from "@/models/Announcement";
import { useState } from "react";
import { AnnouncementFormData } from "./types";

export const useAnnouncementSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAnnouncement = async (formData: AnnouncementFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/v1/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "1",
          title: formData.title,
          description: formData.description,
          location: formData.metadata.location || "Non spécifié",
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

  const updateAnnouncement = async (
    announcementId: number | string | undefined,
    formData: AnnouncementFormData,
    originalAnnouncement?: IAnnouncementDTO
  ) => {
    if (!announcementId) {
      const errorMessage = "ID de l'annonce manquant";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/announcements/${announcementId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: originalAnnouncement?.user_id || "1",
          title: formData.title,
          description: formData.description,
          location: formData.metadata.location || originalAnnouncement?.location || "Non spécifié",
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
    createAnnouncement,
    updateAnnouncement,
  };
};
