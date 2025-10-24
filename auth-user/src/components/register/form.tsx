'use client'


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {  EyeIcon, EyeOffIcon, Loader } from "lucide-react"
import React, { useState } from "react"
import {FieldValues, useForm } from "react-hook-form"
import { useHookFormMask } from "use-mask-input"
import {zodResolver} from '@hookform/resolvers/zod'
import type { UserRegister } from "@/schema"
import {userRegisterSchema} from "@/schema"





export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);


  const {
    handleSubmit,
    register,
    setValue,

    formState:{isSubmitting, errors}} = useForm({resolver:zodResolver(userRegisterSchema)});

    const registerWithMask = useHookFormMask(register);

  async function handleZipCodeBlur(e: React.FocusEvent<HTMLInputElement>) {
    const zipcode =e.target.value;
    const res =  await fetch(`https://brasilapi.com.br/api/cep/v2/${zipcode}`)

    if (res.ok){
      const data = await res.json();
      setValue('city', data.city);
      setValue('state', data.state);

    }
      
  }

 async function onSubmit(data: FieldValues) {
    const res = await fetch('https://apis.codante.io/api/register-user/register', 
     {method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),})

    const resData = await res.json();
    console.log(resData)
}

  

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
              <Input
               type="text"
               id="name"
                {...register("name")}
                />
                <FieldDescription className="text-red-500" >
                  {errors.name?.message as string}
                </FieldDescription>
      
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                {...register('email')}
                type="email"
                placeholder="m@example.com"
                />
              <FieldDescription className="text-red-500" >
                 {errors.email?.message as string}
                </FieldDescription>
            </Field>
              <Field className="relative">
              <FieldLabel htmlFor="password">senha</FieldLabel>
              <Input 
                id="password"
                {...register('password')}
                type={isPasswordVisible ? 'text' : 'password'}
                className="pr-10"
                />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-end">
                <button type="button" onClick={() => setIsPasswordVisible (!isPasswordVisible)}
                 >
                  {isPasswordVisible ?(
                  <EyeIcon size={20}  className="  text-slate-600 cursor-pointer" /> )
                  : (
                  <EyeOffIcon size={20} className="  text-slate-600 cursor-pointer" />
                  )}
                </button>
              </span>
              <FieldDescription className="text-red-500" >
                  {errors.password?.message as string}
                </FieldDescription>
            </Field>
            
            <Field className="relative">
              <FieldLabel htmlFor="confirm-password">
                Confirma senha
              </FieldLabel>
              <Input id="confirm-password"
              {...register('password_confirmation')}
              type={isPasswordVisible ? 'text' : 'password'} />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-end">
                <button type="button" onClick={() => setIsPasswordVisible (!isPasswordVisible)}
                 >
                  {isPasswordVisible ?(
                  <EyeIcon size={20}  className="  text-slate-600 cursor-pointer" /> )
                  : (
                  <EyeOffIcon size={20} className="  text-slate-600 cursor-pointer" />
                  )}
                </button>
              </span>
              <FieldDescription className="text-red-500" >
                  {errors.password_confirmation?.message as string}
                </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="cep">CEP</FieldLabel>
              <Input 
              id="cep"
              {...registerWithMask('zipcode', '99999-999')}
              onBlur={handleZipCodeBlur}
              type="text" />

              <FieldDescription className="text-red-500" >
                {errors.zipcode?.message as string}
                </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="city">Cidade</FieldLabel>
              <Input id="city" type="text" required disabled className="disabled:bg-slate-200"
              {...register('city')} />
            </Field>

            <Field>
              <FieldLabel htmlFor="state">estado</FieldLabel>
              <Input id="state" type="text" required disabled className="disabled:bg-slate-200" 
              {...register ('state')} />
            </Field>

            <FieldGroup>
              <Field>
                <Button 
                type="submit"
                disabled={isSubmitting}>
                  {isSubmitting ? <Loader className="animate-spin"/> : 'Criar uma conta'}
                </Button>
                <Button variant="outline" type="button">
                 Cadastre-se com o Google
                </Button>
                <FieldDescription className="px-6 text-center">
                  Já tem uma conta? <a href="#">Entrar</a>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

