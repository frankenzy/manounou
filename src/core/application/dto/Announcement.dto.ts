/**
 * DTO: Announcement Data Transfer Objects
 * Utilisés pour les inputs/outputs des use cases
 */

// Pour les réponses (sans password)
export interface AnnouncementResponseDTO {
   id?: number;
   user_id: string;
   title: string;
   description: string;
   location: string;
   created_at?: Date;
   updated_at?: Date;
   metadata?: Record<string, unknown>;
}

// Pour les créations
export interface CreateAnnouncementDTO {
   user_id: string;
   title: string;
   description: string;
   location: string;
   metadata?: Record<string, unknown>;
}

// Pour les mises à jour
export interface UpdateAnnouncementDTO {
   title?: string;
   description?: string;
   location?: string;
   metadata?: Record<string, unknown>;
}

// Pour les recherches
export interface SearchAnnouncementDTO {
   query: string;
}

export interface AnnouncementFilterDTO {
   user_id?: string;
   location?: string;
}
