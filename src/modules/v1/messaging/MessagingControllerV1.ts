import { type NextRequest } from "next/server";
import { fail, getJsonBody, ok } from "../shared/http";
import { type MessagingServiceV1 } from "./MessagingServiceV1";

export class MessagingControllerV1 {
   constructor(private readonly service: MessagingServiceV1) { }

   async listConversations(userId?: string) {
      try {
         return ok(await this.service.listConversations(userId));
      } catch (error) {
         return fail(error);
      }
   }

   async createConversation(request: NextRequest) {
      try {
         const payload = await getJsonBody<Parameters<MessagingServiceV1["createConversation"]>[0]>(
            request,
         );
         return ok(await this.service.createConversation(payload), 201);
      } catch (error) {
         return fail(error);
      }
   }

   async listMessages(conversationId: string) {
      try {
         return ok(await this.service.listMessages(conversationId));
      } catch (error) {
         return fail(error);
      }
   }

   async createMessage(request: NextRequest, conversationId: string) {
      try {
         const payload = await getJsonBody<Omit<Parameters<MessagingServiceV1["createMessage"]>[0], "conversationId">>(
            request,
         );
         return ok(await this.service.createMessage({ ...payload, conversationId }), 201);
      } catch (error) {
         return fail(error);
      }
   }
}
