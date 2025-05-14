
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, UserRole } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, UserPlus, UserCog } from "lucide-react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Schema de validação para formulário de usuário
const userFormSchema = z.object({
  nome: z.string().min(3, "Nome deve ter no mínimo 3 caracteres"),
  email: z.string().email("Email inválido"),
  senha: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  role: z.enum(["administrador", "tecnico", "gestor"] as const),
});

type UserFormValues = z.infer<typeof userFormSchema>;

// Componente para o formulário de usuário
const UserForm = ({ onSubmit, defaultValues, role }: { 
  onSubmit: (data: UserFormValues) => void, 
  defaultValues?: Partial<UserFormValues>,
  role?: UserRole 
}) => {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: defaultValues || {
      nome: "",
      email: "",
      senha: "",
      role: role || "tecnico",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome</FormLabel>
              <FormControl>
                <Input placeholder="Nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@exemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="senha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {!role && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Usuário</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="administrador">Administrador</SelectItem>
                    <SelectItem value="tecnico">Técnico</SelectItem>
                    <SelectItem value="gestor">Gestor</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button type="submit" className="w-full">Salvar</Button>
      </form>
    </Form>
  );
};

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
  const [dialogType, setDialogType] = useState<'tecnico-admin' | 'gestor'>('tecnico-admin');

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
              <Dialog open={openDialog && dialogType === 'tecnico-admin'} onOpenChange={(open) => {
                setOpenDialog(open);
                if (open) setDialogType('tecnico-admin');
              }}>
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
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Função</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...adminUsers, ...tecnicoUsers].map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {user.role === 'administrador' ? 'Administrador' : 'Técnico'}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Editar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="gestores">
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestores</h2>
              <Dialog open={openDialog && dialogType === 'gestor'} onOpenChange={(open) => {
                setOpenDialog(open);
                if (open) setDialogType('gestor');
              }}>
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
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Clientes</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {gestorUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.nome}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        0 clientes
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Editar</Button>
                          <Button variant="outline" size="sm">Clientes</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GerenciamentoUsuarios;
