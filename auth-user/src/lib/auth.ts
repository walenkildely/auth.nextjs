import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
const prisma = new PrismaClient();
export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite", // or "mysql", "postgresql", ...etc
    }),
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      name: {
        type: "string",
        required: true,
      },
      zipcode: {
        type: "string",
        required: true,
      },
      city: {
        type: "string",
        required: true,
      },
      state: {
        type: "string",
        required: true, 
        },
    },
  },
  plugins: [nextCookies()],
});
