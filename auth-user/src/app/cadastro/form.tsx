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
import { Loader, User, Mail, Lock, MapPin, CheckCircle2 } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHookFormMask } from "use-mask-input";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UserRegister } from "@/schema";
import { userRegisterSchema } from "@/schema";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { PasswordToggle } from "@/components/passwordToggle";

export function RegisterForm({
  ...props
}: React.ComponentProps<typeof Card>) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <Card 
        {...props} 
        className="w-full max-w-md sm:max-w-lg shadow-2xl border-0 bg-white/90 backdrop-blur"
      >
        <CardHeader className="space-y-2 pb-6">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-2">
            <User className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Criar uma conta
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Insira suas informações abaixo para criar sua conta
          </CardDescription>
        </CardHeader>
        
        <CardContent className="px-4 sm:px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup className="space-y-4 sm:space-y-5">
              {/* Nome */}
              <Field>
                <FieldLabel htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                  <User className="w-4 h-4 text-slate-500" />
                  Nome Completo
                </FieldLabel>
                <Input 
                  type="text" 
                  id="name" 
                  {...register("name")} 
                  className="h-11"
                  placeholder="Digite seu nome completo"
                />
                <FieldDescription className="text-red-500 text-xs sm:text-sm">
                  {errors.name?.message}
                </FieldDescription>
              </Field>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="w-4 h-4 text-slate-500" />
                  Email
                </FieldLabel>
                <Input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="seu@email.com"
                  className="h-11"
                />
                <FieldDescription className="text-red-500 text-xs sm:text-sm">
                  {errors.email?.message}
                </FieldDescription>
              </Field>

              {/* Senhas em Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Senha */}
                <Field>
                  <FieldLabel htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="w-4 h-4 text-slate-500" />
                    Senha
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="password"
                      {...register("password")}
                      type={isPasswordVisible1 ? "text" : "password"}
                      className="pr-10 h-11"
                      placeholder="••••••••"
                    />
                    <PasswordToggle
                      isVisible={isPasswordVisible1}
                      onToggle={() => setIsPasswordVisible1(!isPasswordVisible1)}
                    />
                  </div>
                  <FieldDescription className="text-red-500 text-xs sm:text-sm">
                    {errors.password?.message}
                  </FieldDescription>
                </Field>

                {/* Confirmar Senha */}
                <Field>
                  <FieldLabel htmlFor="confirm-password" className="flex items-center gap-2 text-sm font-medium">
                    <Lock className="w-4 h-4 text-slate-500" />
                    Confirmar
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="confirm-password"
                      {...register("password_confirmation")}
                      type={isPasswordVisible2 ? "text" : "password"}
                      className="pr-10 h-11"
                      placeholder="••••••••"
                    />
                    <PasswordToggle
                      isVisible={isPasswordVisible2}
                      onToggle={() => setIsPasswordVisible2(!isPasswordVisible2)}
                    />
                  </div>
                  <FieldDescription className="text-red-500 text-xs sm:text-sm">
                    {errors.password_confirmation?.message}
                  </FieldDescription>
                </Field>
              </div>

              {/* Localização */}
              <div className="space-y-4 sm:space-y-5 pt-2">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MapPin className="w-4 h-4 text-indigo-500" />
                  <span>Localização</span>
                </div>

                {/* CEP */}
                <Field>
                  <FieldLabel htmlFor="cep" className="text-sm font-medium">
                    CEP
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id="cep"
                      {...registerWithMask("zipcode", "99999-999")}
                      onBlur={handleZipCodeBlur}
                      type="text"
                      className="h-11"
                      placeholder="00000-000"
                    />
                    {cepLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader className="animate-spin text-indigo-500" size={18} />
                      </div>
                    )}
                  </div>
                  <FieldDescription className="text-red-500 text-xs sm:text-sm">
                    {errors.zipcode?.message || cepError}
                  </FieldDescription>
                </Field>

                {/* Cidade e Estado em Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="city" className="text-sm font-medium">
                      Cidade
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        readOnly
                        id="city"
                        type="text"
                        required
                        className="read-only:bg-slate-100 read-only:cursor-not-allowed h-11 pr-8"
                        {...register("city")}
                        placeholder="Cidade"
                      />
                      {city && (
                        <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="state" className="text-sm font-medium">
                      Estado
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        readOnly
                        id="state"
                        type="text"
                        required
                        className="read-only:bg-slate-100 read-only:cursor-not-allowed h-11 pr-8"
                        {...register("state")}
                        placeholder="UF"
                      />
                      {state && (
                        <CheckCircle2 className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                      )}
                    </div>
                  </Field>
                </div>
              </div>

              {errorMessage && <ErrorMessage message={errorMessage} />}

              {/* Botão de Submit */}
              <div className="space-y-4 pt-2">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2" size={18} />
                      Criando conta...
                    </>
                  ) : (
                    "Criar conta"
                  )}
                </Button>
                
                <p className="text-center text-xs sm:text-sm text-slate-600">
                  Já tem uma conta?{" "}
                  <a 
                    href="/login" 
                    className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 transition-colors"
                  >
                    Entrar
                  </a>
                </p>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}