import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import { prisma } from "@/shared/infrastructure/db/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
   adapter: PrismaAdapter(prisma),
   session: { strategy: "jwt" },
   pages: {
      signIn: "/login",
   },
   providers: [
      Credentials({
         name: "Credentials",
         credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
         },
         async authorize(credentials) {
            const email = credentials.email as string;
            const password = credentials.password as string;

            if (!email || !password) {
               return null;
            }

            const user = await prisma.user.findUnique({ where: { email } });
            if (!user?.passwordHash) {
               return null;
            }

            const isValid = await bcrypt.compare(password, user.passwordHash);
            if (!isValid) {
               return null;
            }

            return {
               id: user.id,
               email: user.email,
               name: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email,
            };
         },
      }),
   ],
   callbacks: {
      async jwt({ token, user }) {
         if (user?.id) {
            token.userId = user.id;
         }
         return token;
      },
      async session({ session, token }) {
         if (session.user) {
            session.user.id = token.userId as string;
         }
         return session;
      },
   },
});
