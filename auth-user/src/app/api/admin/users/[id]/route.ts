// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// PATCH /api/admin/users/:id - Editar usuário
export async function PATCH(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> } // <- params é Promise
) {
  try {
    const { id } = await ctx.params; // <- await aqui
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const body = await request.json();
    const { name, password } = body as { name?: string; password?: string };

    // Monta os dados de update
    const data: any = {};
    if (typeof name === "string" && name.trim() !== "") {
      data.name = name.trim();
    }

    // Se veio password, hash e atualiza em Account.password
    if (typeof password === "string" && password.trim() !== "") {
      const hashed = await bcrypt.hash(password, 10);
      data.accounts = {
        updateMany: {
          where: { userId: id },
          data: { password: hashed },
        },
      };
      // Se existir cenário sem Account criada, poderia usar upsert aqui
      // data.accounts = { upsert: [...] }
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Nada para atualizar" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        zipcode: true,
        city: true,
        state: true,
        role: true,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Erro ao editar usuário:", error);
    return NextResponse.json({ error: "Erro ao editar usuário" }, { status: 500 });
  }
}

// DELETE /api/admin/users/:id - Deletar usuário
export async function DELETE(
  request: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await ctx.params; // <- await aqui
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    if (user.role === "ADMIN") {
      return NextResponse.json({ error: "Não é possível deletar administradores" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao deletar usuário:", error);
    return NextResponse.json({ error: "Erro ao deletar usuário" }, { status: 500 });
  }
}
