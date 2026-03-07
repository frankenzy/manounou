import { type NextRequest } from "next/server";
import { fail, getJsonBody, ok, requireParam } from "../shared/http";
import { type UserServiceV1 } from "./UserServiceV1";

export class UserControllerV1 {
   constructor(private readonly service: UserServiceV1) { }

   async listUsers() {
      try {
         return ok(await this.service.listUsers());
      } catch (error) {
         return fail(error);
      }
   }

   async createUser(request: NextRequest) {
      try {
         const payload = await getJsonBody<Parameters<UserServiceV1["createUser"]>[0]>(request);
         return ok(await this.service.createUser(payload), 201);
      } catch (error) {
         return fail(error);
      }
   }

   async getUser(id: string) {
      try {
         return ok(await this.service.getUserById(id));
      } catch (error) {
         return fail(error);
      }
   }

   async updateUser(request: NextRequest, id: string) {
      try {
         const payload = await getJsonBody<Parameters<UserServiceV1["updateUser"]>[1]>(request);
         return ok(await this.service.updateUser(id, payload));
      } catch (error) {
         return fail(error);
      }
   }

   async deleteUser(id: string) {
      try {
         return ok(await this.service.deleteUser(id));
      } catch (error) {
         return fail(error);
      }
   }

   async getProfile(userId: string) {
      try {
         return ok(await this.service.getProfile(userId));
      } catch (error) {
         return fail(error);
      }
   }

   async upsertProfile(request: NextRequest, userId: string) {
      try {
         const payload = await getJsonBody<Parameters<UserServiceV1["upsertProfile"]>[1]>(request);
         return ok(await this.service.upsertProfile(userId, payload));
      } catch (error) {
         return fail(error);
      }
   }

   async listDocuments(userId: string) {
      try {
         return ok(await this.service.listDocuments(userId));
      } catch (error) {
         return fail(error);
      }
   }

   async createDocument(request: NextRequest, userId: string) {
      try {
         const payload = await getJsonBody<Omit<Parameters<UserServiceV1["createDocument"]>[0], "userId">>(
            request,
         );
         return ok(
            await this.service.createDocument({
               ...payload,
               userId: requireParam(userId, "userId"),
            }),
            201,
         );
      } catch (error) {
         return fail(error);
      }
   }

   async listNotifications(userId: string) {
      try {
         return ok(await this.service.listNotifications(userId));
      } catch (error) {
         return fail(error);
      }
   }

   async createNotification(request: NextRequest, userId: string) {
      try {
         const payload = await getJsonBody<Omit<Parameters<UserServiceV1["createNotification"]>[0], "userId">>(
            request,
         );
         return ok(
            await this.service.createNotification({
               ...payload,
               userId: requireParam(userId, "userId"),
            }),
            201,
         );
      } catch (error) {
         return fail(error);
      }
   }

   async listReports() {
      try {
         return ok(await this.service.listReports());
      } catch (error) {
         return fail(error);
      }
   }

   async createReport(request: NextRequest) {
      try {
         const payload = await getJsonBody<Parameters<UserServiceV1["createReport"]>[0]>(request);
         return ok(await this.service.createReport(payload), 201);
      } catch (error) {
         return fail(error);
      }
   }
}
