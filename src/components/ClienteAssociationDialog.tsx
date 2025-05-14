
import React from 'react';
import { User, Cliente } from "@/types";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ClienteAssociationDialogProps {
  editingUser: User | null;
  clientes: Cliente[];
  selectedClientes: string[];
  handleClienteToggle: (clienteId: string) => void;
  handleSaveClientesAssociation: () => void;
  onClose: () => void;
}

export function ClienteAssociationDialog({
  editingUser,
  clientes,
  selectedClientes,
  handleClienteToggle,
  handleSaveClientesAssociation,
  onClose
}: ClienteAssociationDialogProps) {
  return (
    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          Gerenciar Clientes do Gestor: {editingUser?.nome}
        </DialogTitle>
      </DialogHeader>
      
      <div className="py-4">
        <div className="mb-4">
          <h4 className="font-medium mb-2">Selecione os clientes para este gestor:</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Os clientes selecionados serão gerenciados por este gestor
          </p>
        </div>
        
        {clientes.length > 0 ? (
          <div className="space-y-2">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="flex items-center space-x-2 p-2 hover:bg-muted/50 rounded-md">
                <Checkbox 
                  id={`cliente-${cliente.id}`}
                  checked={selectedClientes.includes(cliente.id)}
                  onCheckedChange={() => handleClienteToggle(cliente.id)}
                />
                <Label 
                  htmlFor={`cliente-${cliente.id}`}
                  className="flex-1 cursor-pointer"
                >
                  {cliente.nome}
                  <p className="text-xs text-muted-foreground">{cliente.email}</p>
                </Label>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center py-4 text-muted-foreground">Nenhum cliente disponível</p>
        )}
        
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSaveClientesAssociation}
          >
            Salvar Alterações
          </Button>
        </div>
      </div>
    </DialogContent>
  );
}
