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
import { ErrorMessage } from "@/components/error-message";
import { Loader, EyeIcon, EyeOffIcon, User, Mail, MapPin, Shield, Calendar } from "lucide-react";
import { PasswordToggle } from "@/components/passwordToggle";

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
  const [editPassword, setEditPassword] = useState(""); 
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
    setEditPassword("");
    setEditError("");
  };

  const handleSaveEdit = async () => {
    if (!editingUser) return;
    
    setIsSaving(true);
    setEditError("");

    try {
      const body: any = { name: editName };
      
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
        router.refresh();
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
        router.refresh();
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6 sm:mb-8">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              Painel Administrativo
            </h1>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600">
              <User className="w-4 h-4" />
              <span className="truncate max-w-[200px] sm:max-w-none">
                {session.user.name}
              </span>
              <span className="hidden sm:inline">•</span>
              <span className="truncate max-w-[150px] sm:max-w-none">
                {session.user.email}
              </span>
            </div>
          </div>
          <Button 
            onClick={handleSignOut} 
            variant="outline"
            className="w-full sm:w-auto shadow-sm hover:shadow-md transition-shadow"
          >
            Sair
          </Button>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl sm:text-2xl">Gerenciar Usuários</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Visualize, edite e delete usuários do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="px-3 sm:px-6">
            {errorMessage && (
              <ErrorMessage 
                message={errorMessage} 
                className="mb-4"
              />
            )}
            
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="text-center space-y-3">
                  <Loader className="animate-spin mx-auto text-blue-600" size={32} />
                  <p className="text-slate-500 text-sm">Carregando usuários...</p>
                </div>
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              {users.map((user) => (
                <div key={user.id}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
                    <div className="flex-1 space-y-2 mb-4 sm:mb-0">
                      <div className="flex items-start gap-2">
                        <User className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base sm:text-lg text-slate-900 truncate">
                            {user.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-600 mt-1">
                            <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                            <span className="truncate">{user.email}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-500 pl-7">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">
                          CEP: {user.zipcode} | {user.city} - {user.state}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1.5 pl-7">
                        <Shield className={`w-3.5 h-3.5 ${user.role === "ADMIN" ? "text-amber-500" : "text-slate-400"}`} />
                        <span className={`text-xs font-medium ${user.role === "ADMIN" ? "text-amber-600" : "text-slate-500"}`}>
                          {user.role === "ADMIN" ? "Administrador" : "Usuário"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 sm:ml-4">
                      <Button
                        onClick={() => handleEdit(user)}
                        variant="outline"
                        size="sm"
                        disabled={loading}
                        className="flex-1 sm:flex-none hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                      >
                        Editar
                      </Button>
                      {user.role !== "ADMIN" && (
                        <Button
                          onClick={() => {
                            setDeleteConfirm(user);
                            setDeleteError("");
                          }}
                          variant="destructive"
                          size="sm"
                          disabled={loading}
                          className="flex-1 sm:flex-none hover:bg-red-600 transition-colors"
                        >
                          Deletar
                        </Button>
                      )}
                    </div>
                  </div>
                  {users.indexOf(user) < users.length - 1 && (
                    <Separator className="my-3 sm:my-4" />
                  )}
                </div>
              ))}
              {users.length === 0 && !loading && !errorMessage && (
                <div className="text-center py-12">
                  <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                  <p className="text-slate-500 text-sm">Nenhum usuário encontrado</p>
                </div>
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
          <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">Editar Usuário</DialogTitle>
              <DialogDescription>
                Altere as informações do usuário abaixo
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-5 py-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">Nome</Label>
                <Input
                  id="name"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  disabled={isSaving}
                  className="h-10"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Nova Senha (opcional)
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={isPasswordVisible ? "text" : "password"}
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="Deixe em branco para não alterar"
                    className="pr-10 h-10"
                    disabled={isSaving}
                  />
                  <PasswordToggle
                    isVisible={isPasswordVisible}
                    onToggle={() => setIsPasswordVisible(!isPasswordVisible)}
                  />
                </div>
              </div>
              
              {editError && (
                <ErrorMessage message={editError} />
              )}
            </div>
            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setEditingUser(null);
                  setEditError("");
                  setEditPassword("");
                  setIsPasswordVisible(false);
                }}
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleSaveEdit} 
                disabled={isSaving}
                className="w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Salvando...
                  </>
                ) : "Salvar Alterações"}
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl text-red-600">Confirmar exclusão</DialogTitle>
              <DialogDescription className="pt-2">
                Tem certeza que deseja deletar o usuário{" "}
                <strong className="text-slate-900">{deleteConfirm?.name}</strong>? 
                <br />
                <span className="text-red-600 font-medium">Esta ação não pode ser desfeita.</span>
              </DialogDescription>
            </DialogHeader>
            
            {deleteError && (
              <ErrorMessage message={deleteError} />
            )}
            
            <DialogFooter className="flex-col sm:flex-row gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setDeleteConfirm(null);
                  setDeleteError("");
                }}
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="w-full sm:w-auto"
              >
                {isDeleting ? (
                  <>
                    <Loader className="animate-spin mr-2" size={16} />
                    Deletando...
                  </>
                ) : "Deletar Usuário"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}