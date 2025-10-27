"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SessionUser = {
  id: string;
  email: string;
  name?: string | null;
  role?: string | null;
  zipcode?: string | null;
  city?: string | null;
  state?: string | null;
};

type Props = {
  session: { user: SessionUser };
};

export default function DashboardClient({ session }: Props) {
  const router = useRouter();
  const user = session.user;

  // Se quiser tratar ADMIN aqui (recomendo fazer no server page.tsx)
  // useEffect(() => {
  //   if (user.role === "ADMIN") router.replace("/admin");
  // }, [user.role, router]);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/"); // navegação suave; se preferir hard reload: window.location.href = "/"
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Área do Usuário</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sair
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Bem-vindo, {user.name ?? "Usuário"}!</CardTitle>
            <CardDescription>
              Esta é sua área autenticada. Aqui você pode visualizar seus dados.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Meus Dados</CardTitle>
            <CardDescription>Visualize suas informações cadastradas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome</p>
              <p className="text-lg">{user.name ?? "-"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg">{user.email}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">CEP</p>
              <p className="text-lg">{user.zipcode ?? "-"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Cidade</p>
              <p className="text-lg">{user.city ?? "-"}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium text-gray-500">Estado</p>
              <p className="text-lg">{user.state ?? "-"}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}