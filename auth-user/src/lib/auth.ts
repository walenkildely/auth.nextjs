import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const auth = betterAuth({
  // 🔗 Conecta o Prisma + SQLite
  database: prismaAdapter(prisma, {
    provider: "sqlite",
  }),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    fields: {
      name: "string",
      zipcode: "string",
      city: "string",
      state: "string",
    },
  },
});
