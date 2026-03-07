import {
   type CreateConversationInput,
   type CreateMessageInput,
   MessagingRepositoryV1,
} from "./MessagingRepositoryV1";
import { HttpError } from "../shared/http";

export class MessagingServiceV1 {
   constructor(private readonly repository: MessagingRepositoryV1) { }

   listConversations(userId?: string) {
      return this.repository.listConversations(userId);
   }

   createConversation(input: CreateConversationInput) {
      if (!input.senderId || !input.content) {
         throw new HttpError(400, "senderId and content are required");
      }
      return this.repository.createConversation(input);
   }

   async listMessages(conversationId: string) {
      const conversation = await this.repository.getConversationById(conversationId);
      if (!conversation) {
         throw new HttpError(404, "Conversation not found");
      }
      return this.repository.listMessages(conversationId);
   }

   async createMessage(input: CreateMessageInput) {
      if (!input.conversationId || !input.senderId || !input.content) {
         throw new HttpError(400, "conversationId, senderId and content are required");
      }

      const conversation = await this.repository.getConversationById(input.conversationId);
      if (!conversation) {
         throw new HttpError(404, "Conversation not found");
      }

      return this.repository.createMessage(input);
   }
}
