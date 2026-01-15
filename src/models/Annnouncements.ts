export interface IAnnouncement {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  location: number;
  createdAt?: Date;
  updatedAt?: Date;
}


export interface IAnnouncementDTO {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  location: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Announcement implements IAnnouncement {
  id?: number;
  user_id: string;
  title: string;
  description: string;
  location: number;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(data: IAnnouncement) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.title = data.title;
    this.description = data.description;
    this.location = data.location;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }


 Announcement(): IAnnouncementDTO {
    return {
      id: this.id,
      user_id: this.user_id,
      title: this.title,
      description: this.description,
      location: this.location,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}