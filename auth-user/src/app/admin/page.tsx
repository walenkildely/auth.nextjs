import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";
import AdminClient from "./admin-client";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/login");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
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
  });

  return <AdminClient initialUsers={users} session={session} />;
}
