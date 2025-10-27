import { z } from "zod";

/** Helpers */
const trim = (s: string) => s.trim();

/** Cadastro */
export const userRegisterSchema = z
  .object({
    name: z
      .string()
      .min(1, { message: "o campo nome precisa ser preenchido" })
      .max(100, { message: "o campo nome não pode ter mais de 100 caracteres" })
      .transform(trim),

    email: z
      .string()
      .min(1, { message: "o campo email precisa ser preenchido" })
      .max(254, { message: "email muito longo" })
      .email({ message: "email inválido" })
      .transform((s) => s.trim().toLowerCase()),

    password: z
      .string()
      .min(8, { message: "a senha precisa ter pelo menos 8 caracteres" })
      .regex(/(?=.*[a-z])/, { message: "a senha precisa ter letra minúscula" })
      .regex(/(?=.*[A-Z])/, { message: "a senha precisa ter letra maiúscula" })
      .regex(/(?=.*\d)/, { message: "a senha precisa ter número" })
      .regex(/(?=.*[@$!%*?&])/, { message: "a senha precisa ter caractere especial" }),

    password_confirmation: z
      .string()
      .min(1, { message: "a confirmação de senha precisa ser preenchida" }),

    zipcode: z
      .string()
      .min(1, { message: "o campo CEP precisa ser preenchido" })
      .regex(/^\d{5}-?\d{3}$/, { message: "CEP inválido" })
      .transform((s) => s.replace(/\D/g, "")),

    city: z
      .string()
      .min(1, { message: "o campo cidade precisa ser preenchido" })
      .max(80, { message: "cidade muito longa" })
      .transform(trim),

    state: z
      .string()
      .min(1, { message: "o campo estado precisa ser preenchido" })
      .regex(/^[A-Za-z]{2}$/, { message: "UF inválida (use ex: MG)" })
      .transform((s) => s.trim().toUpperCase()),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "as senhas não correspondem",
    path: ["password_confirmation"],
  });

export type UserRegister = z.infer<typeof userRegisterSchema>;

/** Payload para signUp (sem confirmação) */
export const signUpPayloadSchema = userRegisterSchema.omit({
  password_confirmation: true,
});
export type SignUpPayload = z.infer<typeof signUpPayloadSchema>;

/** Login */
export const signInSchema = z.object({
  email: z
    .string()
    .min(1, { message: "email obrigatório" })
    .email({ message: "email inválido" })
    .transform((s) => s.trim().toLowerCase()),
  password: z.string().min(1, "informe a senha"),
});
export type SignInInput = z.infer<typeof signInSchema>;
