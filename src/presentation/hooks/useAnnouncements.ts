/**
 * Hook: useAnnouncement
 * Hook personnalisé pour récupérer une annonce par ID
 */

import { AnnouncementResponseDTO } from '@/core/application/dto/Announcement.dto';
import { useEffect, useState } from 'react';

export function useAnnouncement(id: number | null) {
  const [announcement, setAnnouncement] =
    useState<AnnouncementResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(id !== null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/announcements/${id}`);
        const data = await response.json();

        if (data.success) {
          setAnnouncement(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch announcement');
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        setError(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { announcement, isLoading, error };
}
