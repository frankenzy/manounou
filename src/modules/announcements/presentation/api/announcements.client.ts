import { AnnouncementDTO } from "@/modules/announcements/application/dto/AnnouncementDTO";

type ApiResponse<T> = {
   success: boolean;
   data: T;
   message?: string;
};

async function parseResponse<T>(response: Response): Promise<T> {
   const json = (await response.json()) as ApiResponse<T>;
   if (!response.ok || !json.success) {
      throw new Error(json.message || "Request failed");
   }
   return json.data;
}

export const announcementsClient = {
   async list(page = 1, limit = 20, q?: string): Promise<AnnouncementDTO[]> {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (q) {
         params.set("q", q);
      }

      const response = await fetch(`/api/v1/announcements?${params.toString()}`, {
         method: "GET",
      });
      return parseResponse<AnnouncementDTO[]>(response);
   },

   async create(payload: {
      title: string;
      description: string;
      location: string;
      metadata?: Record<string, unknown>;
   }): Promise<AnnouncementDTO> {
      const response = await fetch("/api/v1/announcements", {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify(payload),
      });
      return parseResponse<AnnouncementDTO>(response);
   },
};
