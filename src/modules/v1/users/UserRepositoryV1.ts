import {
   type AccountStatus,
   type DocumentStatus,
   type DocumentType,
   type ReportReason,
   type UserRole,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateUserInput {
   phone: string;
   role: UserRole;
   email?: string;
   password?: string;
   status?: AccountStatus;
   isVerified?: boolean;
   trustScore?: number;
   metaData?: Record<string, unknown>;
}

export interface UpdateUserInput {
   phone?: string;
   role?: UserRole;
   email?: string | null;
   password?: string | null;
   status?: AccountStatus;
   isVerified?: boolean;
   trustScore?: number;
   metaData?: Record<string, unknown>;
}

export interface UpsertProfileInput {
   fullName?: string;
   avatarUrl?: string;
   bio?: Record<string, unknown>;
   gender?: string;
   experience?: number;
   rating?: number;
   locationId?: string;
}

export interface CreateDocumentInput {
   userId: string;
   type: DocumentType;
   fileUrl: string;
   status?: DocumentStatus;
}

export interface CreateNotificationInput {
   userId: string;
   content: string;
   isRead?: boolean;
}

export interface CreateReportInput {
   reporterId: string;
   reportedId: string;
   reason: ReportReason;
   description?: string;
}

export class UserRepositoryV1 {
   listUsers() {
      return prisma.user.findMany({
         orderBy: { createdAt: "desc" },
         include: { profile: true },
      });
   }

   getUserById(id: string) {
      return prisma.user.findUnique({
         where: { id },
         include: {
            profile: true,
            documents: true,
            notifications: true,
         },
      });
   }

   createUser(input: CreateUserInput) {
      return prisma.user.create({ data: input });
   }

   updateUser(id: string, input: UpdateUserInput) {
      return prisma.user.update({ where: { id }, data: input });
   }

   deleteUser(id: string) {
      return prisma.user.delete({ where: { id } });
   }

   getProfileByUserId(userId: string) {
      return prisma.profile.findUnique({ where: { userId }, include: { location: true } });
   }

   upsertProfile(userId: string, input: UpsertProfileInput) {
      return prisma.profile.upsert({
         where: { userId },
         update: input,
         create: {
            userId,
            ...input,
         },
         include: { location: true },
      });
   }

   listDocuments(userId: string) {
      return prisma.document.findMany({
         where: { userId },
         orderBy: { createdAt: "desc" },
      });
   }

   createDocument(input: CreateDocumentInput) {
      return prisma.document.create({ data: input });
   }

   listNotifications(userId: string) {
      return prisma.notification.findMany({
         where: { userId },
         orderBy: { createdAt: "desc" },
      });
   }

   createNotification(input: CreateNotificationInput) {
      return prisma.notification.create({ data: input });
   }

   listReports() {
      return prisma.report.findMany({
         orderBy: { createdAt: "desc" },
         include: {
            reporter: true,
            reported: true,
         },
      });
   }

   createReport(input: CreateReportInput) {
      return prisma.report.create({ data: input });
   }
}
