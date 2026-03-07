import { type NextRequest } from "next/server";
import { fail, getJsonBody, ok } from "../shared/http";
import { type JobsServiceV1 } from "./JobsServiceV1";

export class JobsControllerV1 {
   constructor(private readonly service: JobsServiceV1) { }

   async listLocations() {
      try {
         return ok(await this.service.listLocations());
      } catch (error) {
         return fail(error);
      }
   }

   async createLocation(request: NextRequest) {
      try {
         const payload = await getJsonBody<Parameters<JobsServiceV1["createLocation"]>[0]>(request);
         return ok(await this.service.createLocation(payload), 201);
      } catch (error) {
         return fail(error);
      }
   }

   async listCategories() {
      try {
         return ok(await this.service.listCategories());
      } catch (error) {
         return fail(error);
      }
   }

   async createCategory(request: NextRequest) {
      try {
         const payload = await getJsonBody<Parameters<JobsServiceV1["createCategory"]>[0]>(request);
         return ok(await this.service.createCategory(payload), 201);
      } catch (error) {
         return fail(error);
      }
   }

   async listJobPosts() {
      try {
         return ok(await this.service.listJobPosts());
      } catch (error) {
         return fail(error);
      }
   }

   async createJobPost(request: NextRequest) {
      try {
         const payload = await getJsonBody<Parameters<JobsServiceV1["createJobPost"]>[0]>(request);
         return ok(await this.service.createJobPost(payload), 201);
      } catch (error) {
         return fail(error);
      }
   }

   async getJobPost(id: string) {
      try {
         return ok(await this.service.getJobPostById(id));
      } catch (error) {
         return fail(error);
      }
   }

   async updateJobPost(request: NextRequest, id: string) {
      try {
         const payload = await getJsonBody<Parameters<JobsServiceV1["updateJobPost"]>[1]>(request);
         return ok(await this.service.updateJobPost(id, payload));
      } catch (error) {
         return fail(error);
      }
   }

   async deleteJobPost(id: string) {
      try {
         return ok(await this.service.deleteJobPost(id));
      } catch (error) {
         return fail(error);
      }
   }

   async listOffers(jobPostId: string) {
      try {
         return ok(await this.service.listOffers(jobPostId));
      } catch (error) {
         return fail(error);
      }
   }

   async createOffer(request: NextRequest, jobPostId: string) {
      try {
         const payload = await getJsonBody<Omit<Parameters<JobsServiceV1["createOffer"]>[0], "jobPostId">>(
            request,
         );
         return ok(await this.service.createOffer({ ...payload, jobPostId }), 201);
      } catch (error) {
         return fail(error);
      }
   }

   async createMatch(request: NextRequest, jobPostId: string) {
      try {
         const payload = await getJsonBody<Omit<Parameters<JobsServiceV1["createMatch"]>[0], "jobPostId">>(
            request,
         );
         return ok(await this.service.createMatch({ ...payload, jobPostId }), 201);
      } catch (error) {
         return fail(error);
      }
   }
}
