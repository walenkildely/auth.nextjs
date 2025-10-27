"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ErrorMessage } from "@/components/feedbacks/error-message";
import { Loader, EyeIcon, EyeOffIcon } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  zipcode: string;
  city: string;
  state: string;
  role: string;
  createdAt: string | Date;
}

interface AdminClientProps {
  initialUsers: User[];
  session: any;
}

export default function AdminClient({ initialUsers, session }: AdminClientProps) {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState("");
  const [editPassword, setEditPassword] = useState(""); // ← FALTAVA ESTE ESTADO
  const [deleteConfirm, setDeleteConfirm] = useState<User | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [editError, setEditError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const fetchUsers = async () => {
    setErrorMessage("");
    setLoading(true);
    
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setErrorMessage(errorData.message || "Erro ao carregar usuários. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao carregar usuários:", error);
      setErrorMessage("Falha na conexão. Verifique sua internet e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditPassword(""); // Limpa a senha
    setEditError(""); // Limpa erros anteriores
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    setIsSaving(true);
    setEditError("");

    try {
      const body: any = { name: editName };
      
      // Só envia senha se foi preenchida
      if (editPassword && editPassword.trim() !== "") {
        body.password = editPassword;
      }

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchUsers();
        router.refresh(); // Atualiza dados do servidor
        setEditingUser(null);
        setEditName("");
        setEditPassword("");
        setIsPasswordVisible(false);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setEditError(errorData.error || "Erro ao editar usuário. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao editar usuário:", error);
      setEditError("Falha na conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    
    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(`/api/admin/users/${deleteConfirm.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchUsers();
        router.refresh(); // Atualiza dados do servidor
        setDeleteConfirm(null);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setDeleteError(errorData.error || "Erro ao deletar usuário. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao deletar usuário:", error);
      setDeleteError("Falha na conexão. Verifique sua internet e tente novamente.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Painel Administrativo</h1>
            <p className="text-sm text-gray-600 mt-1">
              Logado como: {session.user.name} ({session.user.email})
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sair
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Gerenciar Usuários</CardTitle>
            <CardDescription>
              Visualize, edite e delete usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errorMessage && (
              <ErrorMessage 
                message={errorMessage} 
                className="mb-4"
              />
            )}
            
            {loading && (
              <div className="flex justify-center items-center py-8">
                <Loader className="animate-spin mr-2" size={20} />
                <p className="text-gray-500">Carregando usuários...</p>
              </div>
            )}
            
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id}>
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        CEP: {user.zipcode} | {user.city} - {user.state}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Função: {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleEdit(user)}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                      >
                        Editar
                      </Button>
                      {user.role !== "ADMIN" && (
                        <Button
                          onClick={() => {
                            setDeleteConfirm(user);
                            setDeleteError(""); // Limpa erros anteriores
                          }}
                          variant="destructive"
                          size="sm"
                          disabled={loading}
                        >
                          Deletar
                        </Button>
                      )}
                    </div>
                  </div>
                  <Separator className="my-2" />
                </div>
              ))}
              {users.length === 0 && !loading && !errorMessage && (
                <p className="text-center text-gray-500 py-8">
                  Nenhum usuário encontrado
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Dialog de Edição */}
        <Dialog 
          open={!!editingUser} 
          onOpenChange={(open) => {
            if (!open) {
              setEditingUser(null);
              setEditError("");
              setEditPassword("");
              setIsPasswordVisible(false);
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Usuário</DialogTitle>
              <DialogDescription>
                Altere as informações do usuário abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isSaving}
                />
              </div>
              
              <div className="relative">
                <Label htmlFor="password">Nova Senha (opcional)</Label>
                <Input
                  id="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Deixe em branco para não alterar"
                  className="pr-10"
                  disabled={isSaving}
                />
                <span className="absolute right-3 top-9 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    disabled={isSaving}
                  >
                    {isPasswordVisible ? (
                      <EyeIcon
                        size={20}
                        className="text-slate-600 cursor-pointer"
                      />
                    ) : (
                      <EyeOffIcon
                        size={20}
                        className="text-slate-600 cursor-pointer"
                      />
                    )}
                  </button>
                </span>
              </div>
              
              {editError && (
                <ErrorMessage message={editError} />
              )}
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingUser(null);
                  setEditError("");
                  setEditPassword("");
                  setIsPasswordVisible(false);
                }}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Salvando...
                  </>
                ) : "Salvar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Dialog de Confirmação de Delete */}
        <Dialog
          open={!!deleteConfirm}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteConfirm(null);
              setDeleteError("");
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar exclusão</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja deletar o usuário{" "}
                <strong>{deleteConfirm?.name}</strong>? Esta ação não pode ser
                desfeita.
              </DialogDescription>
            </DialogHeader>
            
            {deleteError && (
              <ErrorMessage message={deleteError} />
            )}
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteConfirm(null);
                  setDeleteError("");
                }}
                disabled={isDeleting}
              >
                Cancelar
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                {isDeleting ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Deletando...
                  </>
                ) : "Deletar"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}