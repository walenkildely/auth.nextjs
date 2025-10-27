import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "admin@exemplo.com";
  const password = "Admin123@";

  console.log("🔄 Limpando registros antigos...");
  
  await prisma.account.deleteMany({
    where: { user: { email: email.toLowerCase() } }
  });
  await prisma.user.deleteMany({
    where: { email: email.toLowerCase() }
  });

  console.log("🔄 Criando usuário via Better Auth...");

  
  const { auth } = await import("@/lib/auth");

  try {
    await auth.api.signUpEmail({
      body: {
        email: email.toLowerCase(),
        password: password,
        name: "Administrador",
        zipcode: "00000-000",
        city: "Belo Horizonte",
        state: "MG",
      },
    });
  } catch (error: any) {
    console.error("Erro ao criar usuário:", error.message);
    throw error;
  }


  await prisma.user.update({
    where: { email: email.toLowerCase() },
    data: { 
      role: "ADMIN",
      emailVerified: true,
    },
  });

  console.log("✅ Admin criado com sucesso!");

}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error("❌ Erro fatal:", e);
    prisma.$disconnect().finally(() => process.exit(1));
  });