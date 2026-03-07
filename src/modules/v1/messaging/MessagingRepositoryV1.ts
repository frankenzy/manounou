import { prisma } from "@/lib/prisma";

export interface CreateConversationInput {
   senderId: string;
   content: string;
}

export interface CreateMessageInput {
   conversationId: string;
   senderId: string;
   content: string;
}

export class MessagingRepositoryV1 {
   listConversations(userId?: string) {
      return prisma.conversation.findMany({
         where: userId
            ? {
               messages: {
                  some: {
                     senderId: userId,
                  },
               },
            }
            : undefined,
         orderBy: { createdAt: "desc" },
         include: {
            messages: {
               include: { sender: true },
               orderBy: { createdAt: "asc" },
            },
         },
      });
   }

   createConversation(input: CreateConversationInput) {
      return prisma.conversation.create({
         data: {
            messages: {
               create: {
                  senderId: input.senderId,
                  content: input.content,
               },
            },
         },
         include: {
            messages: {
               include: { sender: true },
               orderBy: { createdAt: "asc" },
            },
         },
      });
   }

   getConversationById(id: string) {
      return prisma.conversation.findUnique({ where: { id } });
   }

   listMessages(conversationId: string) {
      return prisma.message.findMany({
         where: { conversationId },
         orderBy: { createdAt: "asc" },
         include: { sender: true },
      });
   }

   createMessage(input: CreateMessageInput) {
      return prisma.message.create({ data: input, include: { sender: true } });
   }
}
