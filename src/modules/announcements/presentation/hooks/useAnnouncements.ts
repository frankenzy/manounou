"use client";

import { useCallback, useEffect, useState } from "react";
import { AnnouncementDTO } from "@/modules/announcements/application/dto/AnnouncementDTO";
import { announcementsClient } from "@/modules/announcements/presentation/api/announcements.client";

type UseAnnouncementsState = {
   items: AnnouncementDTO[];
   loading: boolean;
   error: string | null;
};

export function useAnnouncements(page = 1, limit = 20, search?: string) {
   const [state, setState] = useState<UseAnnouncementsState>({
      items: [],
      loading: true,
      error: null,
   });

   const refetch = useCallback(async () => {
      setState((previous) => ({ ...previous, loading: true, error: null }));

      try {
         const items = await announcementsClient.list(page, limit, search);
         setState({ items, loading: false, error: null });
      } catch (error) {
         setState({
            items: [],
            loading: false,
            error: error instanceof Error ? error.message : "Failed to load announcements",
         });
      }
   }, [page, limit, search]);

   useEffect(() => {
      refetch();
   }, [refetch]);

   return {
      announcements: state.items,
      isLoading: state.loading,
      error: state.error,
      refetch,
   };
}
