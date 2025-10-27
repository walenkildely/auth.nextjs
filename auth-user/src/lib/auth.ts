import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma"
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "sqlite",
    }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "USER",
        input: false,
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
