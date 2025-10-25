"use server";

import { auth } from "@/lib/auth";
import type { UserRegister } from "@/schema"

export const signUp= async (
    {email,
    password,
    name,
    zipcode,
    city,
    state}: UserRegister) => {
    const result = await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
            zipcode,
            city,
            state,
            callbackURL: "/dashboard"
    },
    });

    return result;
};

export const signIn = async ({
    email, password}: UserRegister) => {
    const result = await auth.api.signInEmail({
        body: {
            email,
            password,
            callbackURL: "/dashboard",
        },
    });
    return result;
} ;
