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
import { ErrorMessage } from "@/components/error-message";
import { Input } from "@/components/ui/input";
import { Loader, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserRegister } from "@/schema";
import { userRegisterSchema } from "@/schema";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { PasswordToggle } from "@/components/passwordToggle";
import { cn } from "@/lib/utils";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isPasswordVisible1, setIsPasswordVisible1] = useState(false);
  const [isPasswordVisible2, setIsPasswordVisible2] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [cepError, setCepError] = useState("");
  const [cepLoading, setCepLoading] = useState(false);

  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister>({
    resolver: zodResolver(userRegisterSchema),
  });

  const registerWithMask = useHookFormMask(register);
  const router = useRouter();

  const city = watch("city");
  const state = watch("state");

  async function handleZipCodeBlur(e: React.FocusEvent<HTMLInputElement>) {
    const zipcode = e.target.value.replace(/\D/g, "");
    setCepError("");

    if (zipcode.length !== 8) {
      setCepError("CEP inválido. Digite os 8 números.");
      return;
    }

    setCepLoading(true);
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
    } finally {
      setCepLoading(false);
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
          onRequest: () => {},
          onSuccess: () => {
            window.location.href = "/dashboard";
          },
          onError: (ctx) => {
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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Criar uma conta</CardTitle>
          <CardDescription>
            Insira suas informações abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Nome */}
              <Field>
                <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
                <Input 
                  type="text" 
                  id="name" 
                  {...register("name")} 
                  placeholder="Digite seu nome completo"
                />
                <FieldDescription className="text-red-500">
                  {errors.name?.message}
                </FieldDescription>
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                />
                <FieldDescription className="text-red-500">
                  {errors.email?.message}
                </FieldDescription>
              </Field>

              {/* Senha */}
              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    {...register("password")}
                    type={isPasswordVisible1 ? "text" : "password"}
                    className="pr-10"
                    placeholder="••••••••"
                  />
                  <PasswordToggle
                    isVisible={isPasswordVisible1}
                    onToggle={() => setIsPasswordVisible1(!isPasswordVisible1)}
                  />
                </div>
                <FieldDescription className="text-red-500">
                  {errors.password?.message}
                </FieldDescription>
              </Field>

              {/* Confirmar Senha */}
              <Field>
                <FieldLabel htmlFor="confirm-password">Confirmar Senha</FieldLabel>
                <div className="relative">
                  <Input
                    id="confirm-password"
                    {...register("password_confirmation")}
                    type={isPasswordVisible2 ? "text" : "password"}
                    className="pr-10"
                    placeholder="••••••••"
                  />
                  <PasswordToggle
                    isVisible={isPasswordVisible2}
                    onToggle={() => setIsPasswordVisible2(!isPasswordVisible2)}
                  />
                </div>
                <FieldDescription className="text-red-500">
                  {errors.password_confirmation?.message}
                </FieldDescription>
              </Field>

              {/* CEP */}
              <Field>
                <FieldLabel htmlFor="cep">CEP</FieldLabel>
                <div className="relative">
                  <Input
                    id="cep"
                    {...registerWithMask("zipcode", "99999-999")}
                    onBlur={handleZipCodeBlur}
                    type="text"
                    placeholder="00000-000"
                  />
                  {cepLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader className="animate-spin" size={18} />
                    </div>
                  )}
                </div>
                <FieldDescription className="text-red-500">
                  {errors.zipcode?.message || cepError}
                </FieldDescription>
              </Field>

              {/* Cidade */}
              <Field>
                <FieldLabel htmlFor="city">Cidade</FieldLabel>
                <div className="relative">
                  <Input
                    readOnly
                    id="city"
                    type="text"
                    required
                    className="read-only:bg-slate-100 read-only:cursor-not-allowed pr-8"
                    {...register("city")}
                    placeholder="Cidade"
                  />
                  {city && (
                    <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </Field>

              {/* Estado */}
              <Field>
                <FieldLabel htmlFor="state">Estado</FieldLabel>
                <div className="relative">
                  <Input
                    readOnly
                    id="state"
                    type="text"
                    required
                    className="read-only:bg-slate-100 read-only:cursor-not-allowed pr-8"
                    {...register("state")}
                    placeholder="UF"
                  />
                  {state && (
                    <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                  )}
                </div>
              </Field>

              {errorMessage && <ErrorMessage message={errorMessage} />}

              {/* Botão de Submit */}
              <Field>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Criando conta..." : "Criar conta"}
                </Button>
                
                <FieldDescription className="text-center">
                  Já tem uma conta?{" "}
                  <a href="/login">Entrar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}