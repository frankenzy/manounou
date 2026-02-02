/**
 * Hook: useAnnouncement
 * Hook personnalisé pour récupérer une annonce par ID
 */

import { AnnouncementResponseDTO } from '@/core/application/dto/Announcement.dto';
import { useEffect, useState, useCallback } from 'react';

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


export function useAnnouncements() {
   const [announcements, setAnnouncements] = useState<AnnouncementResponseDTO[]>([]);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   const fetchAnnouncements = useCallback(async () => {
      try {
         setIsLoading(true);
         setError(null);

         const response = await fetch('/api/announcements');
         const data = await response.json();

         if (data.success && Array.isArray(data.data)) {
            setAnnouncements(data.data);
         } else {
            throw new Error(data.message || 'Failed to fetch announcements');
         }
      } catch (err) {
         const message = err instanceof Error ? err.message : 'Unknown error';
         setError(message);
         setAnnouncements([]);
      } finally {
         setIsLoading(false);
      }
   }, []);

   useEffect(() => {
      fetchAnnouncements();
   }, [fetchAnnouncements]);

   const refetch = useCallback(() => {
      fetchAnnouncements();
   }, [fetchAnnouncements]);

   return {
      announcements,
      isLoading,
      error,
      refetch
   };
}
