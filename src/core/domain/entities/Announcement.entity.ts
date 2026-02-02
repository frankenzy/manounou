/**
 * Entity: Announcement
 * Logique métier pure, aucune dépendance externe
 */
export interface AnnouncementProps {
   id?: number;
   user_id: string;
   title: string;
   description: string;
   location: string;
   created_at?: Date;
   updated_at?: Date;
   metadata?: Record<string, unknown>;
}

export class AnnouncementEntity {
   private readonly id?: number;
   private readonly user_id: string;
   private readonly title: string;
   private readonly description: string;
   private readonly location: string;
   private readonly created_at?: Date;
   private readonly updated_at?: Date;
   private readonly metadata?: Record<string, unknown>;

   constructor(props: AnnouncementProps) {
      this.id = props.id;
      this.user_id = props.user_id;
      this.title = props.title;
      this.description = props.description;
      this.location = props.location;
      this.created_at = props.created_at;
      this.updated_at = props.updated_at;
      this.metadata = props.metadata;

      // Validations métier
      this.validate();
   }

   private validate(): void {
      if (!this.user_id || this.user_id.trim().length === 0) {
         throw new Error('User ID is required');
      }
      if (!this.title || this.title.trim().length < 5) {
         throw new Error('Title must be at least 5 characters');
      }
      if (!this.description || this.description.trim().length < 10) {
         throw new Error('Description must be at least 10 characters');
      }
      if (!this.location || this.location.trim().length === 0) {
         throw new Error('Location is required');
      }
   }

   // Getters (propriétés en lecture seule)
   getId(): number | undefined {
      return this.id;
   }

   getUserId(): string {
      return this.user_id;
   }

   getTitle(): string {
      return this.title;
   }

   getDescription(): string {
      return this.description;
   }

   getLocation(): string {
      return this.location;
   }

   getCreatedAt(): Date | undefined {
      return this.created_at;
   }

   getUpdatedAt(): Date | undefined {
      return this.updated_at;
   }

   getMetadata(): Record<string, unknown> | undefined {
      return this.metadata;
   }

   // Méthode pour convertir en objet plain (pour les DTOs)
   toPrimitives(): AnnouncementProps {
      return {
         id: this.id,
         user_id: this.user_id,
         title: this.title,
         description: this.description,
         location: this.location,
         created_at: this.created_at,
         updated_at: this.updated_at,
         metadata: this.metadata,
      };
   }
}
