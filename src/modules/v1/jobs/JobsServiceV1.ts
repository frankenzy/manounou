import {
   type CreateCategoryInput,
   type CreateJobPostInput,
   type CreateLocationInput,
   type CreateMatchInput,
   type CreateOfferInput,
   JobsRepositoryV1,
   type UpdateJobPostInput,
} from "./JobsRepositoryV1";
import { HttpError } from "../shared/http";

export class JobsServiceV1 {
   constructor(private readonly repository: JobsRepositoryV1) { }

   listLocations() {
      return this.repository.listLocations();
   }

   createLocation(input: CreateLocationInput) {
      if (!input.city) {
         throw new HttpError(400, "city is required");
      }
      return this.repository.createLocation(input);
   }

   listCategories() {
      return this.repository.listCategories();
   }

   createCategory(input: CreateCategoryInput) {
      if (!input.name) {
         throw new HttpError(400, "name is required");
      }
      return this.repository.createCategory(input);
   }

   listJobPosts() {
      return this.repository.listJobPosts();
   }

   async getJobPostById(id: string) {
      const jobPost = await this.repository.getJobPostById(id);
      if (!jobPost) {
         throw new HttpError(404, "JobPost not found");
      }
      return jobPost;
   }

   createJobPost(input: CreateJobPostInput) {
      if (!input.authorId || !input.categoryId || !input.locationId || !input.title) {
         throw new HttpError(400, "authorId, categoryId, locationId and title are required");
      }
      return this.repository.createJobPost(input);
   }

   async updateJobPost(id: string, input: UpdateJobPostInput) {
      await this.getJobPostById(id);
      return this.repository.updateJobPost(id, input);
   }

   async deleteJobPost(id: string) {
      await this.getJobPostById(id);
      await this.repository.deleteJobPost(id);
      return { deleted: true };
   }

   async listOffers(jobPostId: string) {
      await this.getJobPostById(jobPostId);
      return this.repository.listOffers(jobPostId);
   }

   async createOffer(input: CreateOfferInput) {
      if (!input.jobPostId || !input.workerId || input.proposedSalary <= 0) {
         throw new HttpError(400, "jobPostId, workerId and positive proposedSalary are required");
      }
      await this.getJobPostById(input.jobPostId);
      return this.repository.createOffer(input);
   }

   async createMatch(input: CreateMatchInput) {
      if (!input.jobPostId || !input.workerId || input.agreedSalary <= 0) {
         throw new HttpError(400, "jobPostId, workerId and positive agreedSalary are required");
      }
      const jobPost = await this.getJobPostById(input.jobPostId);
      if (jobPost.status === "CLOSED" || jobPost.status === "CANCELLED") {
         throw new HttpError(409, "Cannot match a closed or cancelled job post");
      }
      return this.repository.createMatch(input);
   }
}
