import { z } from "zod";

export const userRegisterSchema = z.object({
    name: z
    .string()
    .min(1, {message: 'o campo nome precisa ser preenchido'})
    .max(100, {message: 'o campo nome não pode ter mais de 100 caracteres'}),
    email: z
    .string()
    .min(1, {message: 'o campo email precisa ser preenchido'})
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, {message: 'email invalido'}),
    password: z
    .string().min(1, {message: 'a senha precisa ser preenchida'})
    .min(8, {message: 'a senha precisa ter pelo menos 8 caracteres'})
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {message: 'a senha deve ter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula, um número e um caractere especial'}),
    password_confirmation: z
    .string()
    .min(1, {message: 'a confirmação de senha precisa ser preenchida'}),
    zipcode: z
    .string()
    .min(1, {message: 'o campo CEP precisa ser preenchido'})
    .regex(/^\d{5}-\d{3}$/, {message: 'CEP invalido'}),
    city: z
    .string()
    .min(1, {message: 'o campo cidade precisa ser preenchido'}),
    state: z
    .string()
    .min(1, {message: 'o campo estado precisa ser preenchido'}),
}).refine((data) =>{
  return  data.password === data.password_confirmation}
  , {
    message: 'As senhas não correspondem',
    path: ['password_confirmation'],
});


export type UserRegister = z.infer<typeof userRegisterSchema>;