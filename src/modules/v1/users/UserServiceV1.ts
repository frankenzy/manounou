import { Prisma } from "@prisma/client";
import {
   type CreateDocumentInput,
   type CreateNotificationInput,
   type CreateReportInput,
   type CreateUserInput,
   type UpdateUserInput,
   type UpsertProfileInput,
   UserRepositoryV1,
} from "./UserRepositoryV1";
import { HttpError } from "../shared/http";

export class UserServiceV1 {
   constructor(private readonly repository: UserRepositoryV1) { }

   listUsers() {
      return this.repository.listUsers();
   }

   async getUserById(id: string) {
      const user = await this.repository.getUserById(id);
      if (!user) {
         throw new HttpError(404, "User not found");
      }
      return user;
   }

   async createUser(input: CreateUserInput) {
      if (!input.phone) {
         throw new HttpError(400, "phone is required");
      }
      if (!input.role) {
         throw new HttpError(400, "role is required");
      }

      try {
         return await this.repository.createUser(input);
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new HttpError(409, "phone or email already exists");
         }
         throw error;
      }
   }

   async updateUser(id: string, input: UpdateUserInput) {
      await this.getUserById(id);
      try {
         return await this.repository.updateUser(id, input);
      } catch (error) {
         if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            throw new HttpError(409, "phone or email already exists");
         }
         throw error;
      }
   }

   async deleteUser(id: string) {
      await this.getUserById(id);
      await this.repository.deleteUser(id);
      return { deleted: true };
   }

   async getProfile(userId: string) {
      await this.getUserById(userId);
      const profile = await this.repository.getProfileByUserId(userId);
      return profile;
   }

   async upsertProfile(userId: string, input: UpsertProfileInput) {
      await this.getUserById(userId);
      return this.repository.upsertProfile(userId, input);
   }

   async listDocuments(userId: string) {
      await this.getUserById(userId);
      return this.repository.listDocuments(userId);
   }

   async createDocument(input: CreateDocumentInput) {
      await this.getUserById(input.userId);
      if (!input.fileUrl) {
         throw new HttpError(400, "fileUrl is required");
      }
      return this.repository.createDocument(input);
   }

   async listNotifications(userId: string) {
      await this.getUserById(userId);
      return this.repository.listNotifications(userId);
   }

   async createNotification(input: CreateNotificationInput) {
      await this.getUserById(input.userId);
      if (!input.content) {
         throw new HttpError(400, "content is required");
      }
      return this.repository.createNotification(input);
   }

   listReports() {
      return this.repository.listReports();
   }

   async createReport(input: CreateReportInput) {
      if (input.reporterId === input.reportedId) {
         throw new HttpError(400, "reporterId and reportedId cannot be the same");
      }
      await this.getUserById(input.reporterId);
      await this.getUserById(input.reportedId);
      return this.repository.createReport(input);
   }
}
