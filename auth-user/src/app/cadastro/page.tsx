import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/app/cadastro/form";

export default async function CadastroPage() {
  // Verifica se já está logado
  const session = await auth.api.getSession({ 
    headers: await headers() 
  });

  // Se já estiver logado, redireciona para o dashboard
  if (session?.user) {
    if (session.user.role === "ADMIN") {
      redirect("/admin");
    } else {
      redirect("/dashboard");
    }
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <RegisterForm/>
      </div>
    </div>
  );
}