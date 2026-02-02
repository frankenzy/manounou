/**
 * DTO: User Data Transfer Objects
 * Utilisés pour les inputs/outputs des use cases
 */

// Pour les réponses (sans password)
export interface UserResponseDTO {
   id?: number;
   username: string;
   email: string;
   firstName?: string;
   lastName?: string;
   created_at?: Date;
   updated_at?: Date;
}

// Pour les créations
export interface CreateUserDTO {
   username: string;
   email: string;
   password: string;
   firstName?: string;
   lastName?: string;
}

// Pour les mises à jour
export interface UpdateUserDTO {
   username?: string;
   email?: string;
   firstName?: string;
   lastName?: string;
}

// Pour les recherches
export interface UserCredentialsDTO {
   email: string;
   password: string;
}
