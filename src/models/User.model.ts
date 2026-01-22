export interface IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  created_ad?: Date;
  updated_at?: Date;
}

export interface IUserDTO {
  id?: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  created_ad?: Date;
  updated_at?: Date;
}

export class User implements IUser {
  id?: number;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  created_ad?: Date;
  updated_at?: Date;

  constructor(data: IUser) {
    this.id = data.id;
    this.username = data.username;
    this.email = data.email;
    this.password = data.password;
    this.firstName = data.firstName;
    this.lastName = data.lastName;
    this.created_ad = data.created_ad;
    this.updated_at = data.updated_at;
  }

  User(): IUserDTO {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      created_ad: this.created_ad,
      updated_at: this.updated_at,
    };
  }
}
