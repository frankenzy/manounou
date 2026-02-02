/**
 * Entity: User
 * Logique métier pure, aucune dépendance externe
 */
export interface UserProps {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  created_at?: Date;
  updated_at?: Date;
}

export class UserEntity {
  private readonly id?: number;
  private readonly username: string;
  private readonly email: string;
  private readonly password: string;
  private readonly firstName?: string;
  private readonly lastName?: string;
  private readonly created_at?: Date;
  private readonly updated_at?: Date;

  constructor(props: UserProps) {
    this.id = props.id;
    this.username = props.username;
    this.email = props.email;
    this.password = props.password;
    this.firstName = props.firstName;
    this.lastName = props.lastName;
    this.created_at = props.created_at;
    this.updated_at = props.updated_at;

    // Validations métier
    this.validate();
  }

  private validate(): void {
    if (!this.username || this.username.trim().length === 0) {
      throw new Error('Username is required');
    }
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Valid email is required');
    }
    if (!this.password || this.password.length === 0) {
      throw new Error('Password is required');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Getters
  getId(): number | undefined {
    return this.id;
  }

  getUsername(): string {
    return this.username;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  getFirstName(): string | undefined {
    return this.firstName;
  }

  getLastName(): string | undefined {
    return this.lastName;
  }

  getCreatedAt(): Date | undefined {
    return this.created_at;
  }

  getUpdatedAt(): Date | undefined {
    return this.updated_at;
  }

  // Méthode pour convertir en objet plain (pour les DTOs)
  toPrimitives(): UserProps {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      created_at: this.created_at,
      updated_at: this.updated_at,
    };
  }
}
