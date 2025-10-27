"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";


import { signInSchema, type SignInInput } from "@/schema";


import { useSession, signIn } from "@/lib/auth-client";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
  });

  // Se já estiver logado, manda para /dashboard (no server você pode redirecionar ADMIN -> /admin)
  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/dashboard");
    }
  }, [isPending, session, router]);

  const onSubmit = async (data: SignInInput) => {
  try {
    setIsLoading(true);
    setErrorMessage("");

    const result = await signIn.email(
      {
        email: data.email,
        password: data.password,
      }
    );

    if (result.error) {
      setErrorMessage(
        result.error.message === "Invalid credentials"
          ? "Email ou senha inválidos."
          : result.error.message || "Erro ao fazer login. Tente novamente."
      );
      return;
    }

    // Hard reload para garantir que o servidor carregue a sessão
    window.location.href = "/dashboard";
    
  } catch (err: any) {
    setErrorMessage(
      err?.message === "Invalid credentials"
        ? "Email ou senha inválidos."
        : err?.message || "Erro ao fazer login. Tente novamente."
    );
  } finally {
    setIsLoading(false);
  }
};


  // Evita piscar o form se já tem sessão
  if (!isPending && session?.user) return null;

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Faça login na sua conta</CardTitle>
          <CardDescription>
            Insira seu email abaixo para fazer login na sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                <FieldDescription className="text-red-500">
                  {errors.email?.message}
                </FieldDescription>
              </Field>

              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Senha</FieldLabel>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                />
                <FieldDescription className="text-red-500">
                  {errors.password?.message}
                </FieldDescription>
              </Field>

              {errorMessage && (
                <p className="text-sm text-center text-red-600">{errorMessage}</p>
              )}

              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Entrando..." : "Login"}
                </Button>
                <FieldDescription className="text-center">
                  Não tem uma conta? <a href="/cadastro">Inscreva-se</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
