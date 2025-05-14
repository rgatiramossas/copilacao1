
import React from 'react';
import { User, Cliente } from "@/types";
import { Pencil, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GestoresListProps {
  gestorUsers: User[];
  clientes: Cliente[];
  openEditDialog: (user: User) => void;
  openClientesDialog: (user: User) => void;
}

export function GestoresList({ gestorUsers, clientes, openEditDialog, openClientesDialog }: GestoresListProps) {
  return (
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
                {clientes.filter(cliente => cliente.gestorId === user.id).length} clientes
              </TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openEditDialog(user)}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => openClientesDialog(user)}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Clientes
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
