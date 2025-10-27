import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import AdminClient from "./admin-client";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await auth.api.getSession({ 
    headers: await headers() 
  });

  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  // Buscar usuários no servidor (melhor performance)
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      zipcode: true,
      city: true,
      state: true,
      role: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return <AdminClient initialUsers={users} session={session} />;
}