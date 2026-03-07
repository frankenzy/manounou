import { type JobStatus, type JobType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export interface CreateLocationInput {
   city: string;
   commune?: string;
   area?: string;
   pada?: string;
   coordinates?: Record<string, unknown>;
}

export interface CreateCategoryInput {
   name: string;
}

export interface CreateJobPostInput {
   authorId: string;
   categoryId: string;
   locationId: string;
   type: JobType;
   title: string;
   description?: string;
   salaryMin?: number;
   salaryMax?: number;
   housing?: boolean;
   transport?: boolean;
   status?: JobStatus;
}

export interface UpdateJobPostInput {
   categoryId?: string;
   locationId?: string;
   type?: JobType;
   title?: string;
   description?: string;
   salaryMin?: number;
   salaryMax?: number;
   housing?: boolean;
   transport?: boolean;
   status?: JobStatus;
}

export interface CreateOfferInput {
   jobPostId: string;
   workerId: string;
   proposedSalary: number;
   message?: string;
}

export interface CreateMatchInput {
   jobPostId: string;
   workerId: string;
   agreedSalary: number;
}

export class JobsRepositoryV1 {
   listLocations() {
      return prisma.location.findMany({ orderBy: { city: "asc" } });
   }

   createLocation(input: CreateLocationInput) {
      return prisma.location.create({ data: input });
   }

   listCategories() {
      return prisma.jobCategory.findMany({ orderBy: { name: "asc" } });
   }

   createCategory(input: CreateCategoryInput) {
      return prisma.jobCategory.create({ data: input });
   }

   listJobPosts() {
      return prisma.jobPost.findMany({
         orderBy: { createdAt: "desc" },
         include: {
            author: true,
            category: true,
            location: true,
            offers: true,
            matches: true,
         },
      });
   }

   getJobPostById(id: string) {
      return prisma.jobPost.findUnique({
         where: { id },
         include: {
            author: true,
            category: true,
            location: true,
            offers: { include: { worker: true } },
            matches: { include: { worker: true } },
         },
      });
   }

   createJobPost(input: CreateJobPostInput) {
      return prisma.jobPost.create({ data: input });
   }

   updateJobPost(id: string, input: UpdateJobPostInput) {
      return prisma.jobPost.update({ where: { id }, data: input });
   }

   deleteJobPost(id: string) {
      return prisma.jobPost.delete({ where: { id } });
   }

   listOffers(jobPostId: string) {
      return prisma.offer.findMany({
         where: { jobPostId },
         orderBy: { createdAt: "desc" },
         include: { worker: true },
      });
   }

   createOffer(input: CreateOfferInput) {
      return prisma.offer.create({ data: input });
   }

   createMatch(input: CreateMatchInput) {
      return prisma.$transaction(async (tx) => {
         const match = await tx.match.create({ data: input });
         await tx.jobPost.update({
            where: { id: input.jobPostId },
            data: { status: "MATCHED" },
         });
         return match;
      });
   }
}
