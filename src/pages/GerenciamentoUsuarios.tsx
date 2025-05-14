
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, Cliente } from "@/types";
import { toast } from "sonner";
import { Users, UserPlus, UserCog } from "lucide-react";
import { clienteService } from "@/services/clienteService";
import { UserForm, UserFormValues } from "@/components/UserForm";
import { TecnicosAdministradoresList } from "@/components/TecnicosAdministradoresList";
import { GestoresList } from "@/components/GestoresList";
import { ClienteAssociationDialog } from "@/components/ClienteAssociationDialog";

// Mock de usuários para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    nome: 'Admin',
    email: 'admin@martelo.com',
    role: 'administrador',
  },
  {
    id: '2',
    nome: 'Técnico',
    email: 'tecnico@martelo.com',
    role: 'tecnico',
  },
  {
    id: '3',
    nome: 'Gestor',
    email: 'gestor@martelo.com',
    role: 'gestor',
  },
];

const GerenciamentoUsuarios = () => {
  const [activeTab, setActiveTab] = useState("tecnicos-admin");
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'tecnico-admin' | 'gestor' | 'clientes'>('tecnico-admin');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [selectedClientes, setSelectedClientes] = useState<string[]>([]);
  
  // Carregar clientes do serviço
  useEffect(() => {
    const fetchClientes = () => {
      const clientesList = clienteService.getClientes();
      setClientes(clientesList);
    };
    
    fetchClientes();
  }, []);

  // Filtrar usuários por tipo
  const adminUsers = users.filter(user => user.role === 'administrador');
  const tecnicoUsers = users.filter(user => user.role === 'tecnico');
  const gestorUsers = users.filter(user => user.role === 'gestor');

  const handleAddUser = (data: UserFormValues) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      nome: data.nome,
      email: data.email,
      role: data.role,
    };
    
    setUsers([...users, newUser]);
    setOpenDialog(false);
    toast.success(`Usuário ${data.nome} adicionado com sucesso!`);
  };

  const handleAddGestor = (data: UserFormValues) => {
    const newUser: User = {
      id: (users.length + 1).toString(),
      nome: data.nome,
      email: data.email,
      role: 'gestor',
    };
    
    setUsers([...users, newUser]);
    setOpenDialog(false);
    toast.success(`Gestor ${data.nome} adicionado com sucesso!`);
  };

  const handleEditUser = (data: UserFormValues) => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(user => {
      if (user.id === editingUser.id) {
        return {
          ...user,
          nome: data.nome,
          email: data.email,
          role: data.role || user.role,
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setOpenDialog(false);
    setEditingUser(null);
    setIsEditing(false);
    toast.success(`Usuário ${data.nome} atualizado com sucesso!`);
  };

  const handleEditGestor = (data: UserFormValues) => {
    if (!editingUser) return;
    
    const updatedUsers = users.map(user => {
      if (user.id === editingUser.id) {
        return {
          ...user,
          nome: data.nome,
          email: data.email,
        };
      }
      return user;
    });
    
    setUsers(updatedUsers);
    setOpenDialog(false);
    setEditingUser(null);
    setIsEditing(false);
    toast.success(`Gestor ${data.nome} atualizado com sucesso!`);
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setIsEditing(true);
    setDialogType(user.role === 'gestor' ? 'gestor' : 'tecnico-admin');
    setOpenDialog(true);
  };

  // Abrir diálogo para gerenciar clientes do gestor
  const openClientesDialog = (user: User) => {
    setEditingUser(user);
    // Pré-seleciona clientes já associados ao gestor
    const clientesDoGestor = clientes
      .filter(cliente => cliente.gestorId === user.id)
      .map(cliente => cliente.id);
    
    setSelectedClientes(clientesDoGestor);
    setDialogType('clientes');
    setOpenDialog(true);
  };

  // Manipular seleção de clientes
  const handleClienteToggle = (clienteId: string) => {
    setSelectedClientes(prev => {
      if (prev.includes(clienteId)) {
        return prev.filter(id => id !== clienteId);
      } else {
        return [...prev, clienteId];
      }
    });
  };

  // Salvar associações de clientes ao gestor
  const handleSaveClientesAssociation = () => {
    if (!editingUser) return;
    
    // Atualizar associações de clientes com gestor
    let updatedCount = 0;
    
    // Remover associação de clientes que foram desmarcados
    clientes.forEach(cliente => {
      const isSelected = selectedClientes.includes(cliente.id);
      const wasAssociated = cliente.gestorId === editingUser.id;
      
      if (wasAssociated && !isSelected) {
        clienteService.updateCliente(cliente.id, { gestorId: undefined });
        updatedCount++;
      } else if (!wasAssociated && isSelected) {
        clienteService.updateCliente(cliente.id, { gestorId: editingUser.id });
        updatedCount++;
      }
    });
    
    setOpenDialog(false);
    setEditingUser(null);
    toast.success(`${updatedCount} associações de clientes foram atualizadas`);
  };

  const closeDialog = () => {
    setOpenDialog(false);
    setEditingUser(null);
    setIsEditing(false);
    setSelectedClientes([]);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="tecnicos-admin" className="flex items-center">
            <Users className="mr-2 h-4 w-4" />
            Técnicos e Administradores
          </TabsTrigger>
          <TabsTrigger value="gestores" className="flex items-center">
            <UserCog className="mr-2 h-4 w-4" />
            Gestores
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tecnicos-admin">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Técnicos e Administradores</h2>
              <Dialog 
                open={openDialog && dialogType === 'tecnico-admin' && !isEditing} 
                onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (open) {
                    setDialogType('tecnico-admin');
                    setIsEditing(false);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Usuário
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Usuário</DialogTitle>
                  </DialogHeader>
                  <UserForm onSubmit={handleAddUser} />
                </DialogContent>
              </Dialog>

              {/* Dialog para edição de usuário técnico/administrador */}
              <Dialog 
                open={openDialog && dialogType === 'tecnico-admin' && isEditing} 
                onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (!open) {
                    setEditingUser(null);
                    setIsEditing(false);
                  }
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Usuário</DialogTitle>
                  </DialogHeader>
                  {editingUser && (
                    <UserForm 
                      onSubmit={handleEditUser} 
                      defaultValues={{
                        nome: editingUser.nome,
                        email: editingUser.email,
                        senha: "",
                        role: editingUser.role as any
                      }}
                      isEditing={true}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <TecnicosAdministradoresList 
              adminUsers={adminUsers}
              tecnicoUsers={tecnicoUsers}
              openEditDialog={openEditDialog}
            />
          </Card>
        </TabsContent>

        <TabsContent value="gestores">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestores</h2>
              <Dialog 
                open={openDialog && dialogType === 'gestor' && !isEditing} 
                onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (open) {
                    setDialogType('gestor');
                    setIsEditing(false);
                  }
                }}
              >
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Novo Gestor
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Gestor</DialogTitle>
                  </DialogHeader>
                  <UserForm onSubmit={handleAddGestor} role="gestor" />
                </DialogContent>
              </Dialog>

              {/* Dialog para edição de gestor */}
              <Dialog 
                open={openDialog && dialogType === 'gestor' && isEditing} 
                onOpenChange={(open) => {
                  setOpenDialog(open);
                  if (!open) {
                    setEditingUser(null);
                    setIsEditing(false);
                  }
                }}
              >
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Editar Gestor</DialogTitle>
                  </DialogHeader>
                  {editingUser && (
                    <UserForm 
                      onSubmit={handleEditGestor} 
                      defaultValues={{
                        nome: editingUser.nome,
                        email: editingUser.email,
                        senha: "",
                        role: "gestor"
                      }}
                      role="gestor"
                      isEditing={true}
                    />
                  )}
                </DialogContent>
              </Dialog>
            </div>

            <GestoresList 
              gestorUsers={gestorUsers}
              clientes={clientes}
              openEditDialog={openEditDialog}
              openClientesDialog={openClientesDialog}
            />

            {/* Dialog para associação de clientes ao gestor */}
            <Dialog 
              open={openDialog && dialogType === 'clientes'} 
              onOpenChange={(open) => {
                setOpenDialog(open);
                if (!open) {
                  setEditingUser(null);
                  setSelectedClientes([]);
                }
              }}
            >
              <ClienteAssociationDialog 
                editingUser={editingUser}
                clientes={clientes}
                selectedClientes={selectedClientes}
                handleClienteToggle={handleClienteToggle}
                handleSaveClientesAssociation={handleSaveClientesAssociation}
                onClose={closeDialog}
              />
            </Dialog>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenciamentoUsuarios;
