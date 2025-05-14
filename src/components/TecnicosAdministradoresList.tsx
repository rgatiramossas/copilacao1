
import React from 'react';
import { User } from "@/types";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TecnicosAdministradoresListProps {
  adminUsers: User[];
  tecnicoUsers: User[];
  openEditDialog: (user: User) => void;
}

export function TecnicosAdministradoresList({ adminUsers, tecnicoUsers, openEditDialog }: TecnicosAdministradoresListProps) {
  return (
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => openEditDialog(user)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
