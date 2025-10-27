"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { ErrorMessage } from "@/components/feedbacks/error-message";
import { Input } from "@/components/ui/input";
import { EyeIcon, EyeOffIcon, Loader } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserRegister } from "@/schema";
import { userRegisterSchema } from "@/schema";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";

export function RegisterForm({
  ...props
}: React.ComponentProps<typeof Card>) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cepError, setCepError] = useState("");

  const {
    handleSubmit,
    register,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister>({
    resolver: zodResolver(userRegisterSchema),
  });

  const registerWithMask = useHookFormMask(register);
  const router = useRouter();

  async function handleZipCodeBlur(e: React.FocusEvent<HTMLInputElement>) {
    const zipcode = e.target.value.replace(/\D/g, "");
    setCepError("");

    if (zipcode.length !== 8) {
      setCepError("Cep inválido. Digite os 8 números.");
      return;
    }

    try {
      const res = await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`);
      if (!res.ok) {
        setCepError("CEP não encontrado. Verifique e tente novamente.");
        return;
      }
      const data = await res.json();
      setValue("city", data.city);
      setValue("state", data.state);
    } catch {
      setCepError("Falha ao buscar CEP. Tente Novamente");
    }
  }

  const onSubmit = async (data: UserRegister) => {
    setErrorMessage("");

    try {
      const result = await signUp.email(
        {
          email: data.email,
          password: data.password,
          name: data.name,
          zipcode: data.zipcode,
          city: data.city,
          state: data.state,
        },
        {
          onRequest: () => {
            // Callback antes da requisição
          },
          onSuccess: () => {
            // Sucesso - redireciona
            window.location.href = "/dashboard";
          },
          onError: (ctx) => {
            // Trata erros específicos
            const error = ctx.error;
            
            if (error.status === 400 || error.message?.includes("already exists") || error.message?.includes("já existe")) {
              setErrorMessage("Este email já está cadastrado. Tente fazer login ou use outro email.");
            } else if (error.message?.includes("email")) {
              setErrorMessage("Email inválido ou já cadastrado.");
            } else {
              setErrorMessage(error.message || "Erro ao criar a conta. Tente novamente.");
            }
          },
        }
      );

      // Se result tiver erro (fallback caso os callbacks não funcionem)
      if (result?.error) {
        const error = result.error;
        
        if (error.status === 400 || error.message?.includes("already exists") || error.message?.includes("já existe")) {
          setErrorMessage("Este email já está cadastrado. Tente fazer login ou use outro email.");
        } else if (error.message?.includes("email")) {
          setErrorMessage("Email inválido ou já cadastrado.");
        } else {
          setErrorMessage(error.message || "Erro ao criar a conta. Tente novamente.");
        }
      }

    } catch (e: any) {
      // Trata erros não capturados
      console.error("Erro no cadastro:", e);
      
      if (e?.message?.includes("already exists") || e?.message?.includes("já existe")) {
        setErrorMessage("Este email já está cadastrado. Tente fazer login ou use outro email.");
      } else if (e?.status === 400 || e?.code === "USER_EXISTS") {
        setErrorMessage("Este email já está cadastrado. Tente fazer login ou use outro email.");
      } else {
        setErrorMessage(e?.message || "Erro ao criar a conta. Tente novamente.");
      }
    }
  };

  return (
    <Card {...props} className="w-full max-w-sm m-auto mt-5">
      <CardHeader>
        <CardTitle>Criar uma conta</CardTitle>
        <CardDescription>
          Insira suas informações abaixo para criar sua conta
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
              <Input type="text" id="name" {...register("name")} />
              <FieldDescription className="text-red-500">
                {errors.name?.message}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                {...register("email")}
                type="email"
                placeholder="m@example.com"
              />
              <FieldDescription className="text-red-500">
                {errors.email?.message}
              </FieldDescription>
            </Field>

            <Field className="relative">
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                {...register("password")}
                type={isPasswordVisible ? "text" : "password"}
                className="pr-10"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeIcon
                      size={20}
                      className="text-slate-600 cursor-pointer"
                    />
                  ) : (
                    <EyeOffIcon
                      size={20}
                      className="text-slate-600 cursor-pointer"
                    />
                  )}
                </button>
              </span>
              <FieldDescription className="text-red-500">
                {errors.password?.message}
              </FieldDescription>
            </Field>

            <Field className="relative">
              <FieldLabel htmlFor="confirm-password">
                Confirma senha
              </FieldLabel>
              <Input
                id="confirm-password"
                {...register("password_confirmation")}
                type={isPasswordVisible ? "text" : "password"}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? (
                    <EyeIcon
                      size={20}
                      className="text-slate-600 cursor-pointer"
                    />
                  ) : (
                    <EyeOffIcon
                      size={20}
                      className="text-slate-600 cursor-pointer"
                    />
                  )}
                </button>
              </span>
              <FieldDescription className="text-red-500">
                {errors.password_confirmation?.message}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="cep">CEP</FieldLabel>
              <Input
                id="cep"
                {...registerWithMask("zipcode", "99999-999")}
                onBlur={handleZipCodeBlur}
                type="text"
              />
              <FieldDescription className="text-red-500">
                {errors.zipcode?.message || cepError}
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="city">Cidade</FieldLabel>
              <Input
                id="city"
                type="text"
                required
                className="disabled:bg-slate-200"
                {...register("city")}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="state">Estado</FieldLabel>
              <Input
                id="state"
                type="text"
                required
                className="disabled:bg-slate-200"
                {...register("state")}
              />
            </Field>

            {errorMessage && <ErrorMessage message={errorMessage} />}

            <FieldGroup>
              <Field>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2" size={16} />
                      Criando conta...
                    </>
                  ) : (
                    "Criar uma conta"
                  )}
                </Button>
                <FieldDescription className="px-6 text-center">
                  Já tem uma conta? <a href="/login" className="underline font-medium">Entrar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}