
import React from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ConfirmDeleteDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteDialog({ onConfirm, onCancel }: ConfirmDeleteDialogProps) {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmar Exclusão</DialogTitle>
        <DialogDescription>
          Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
        </DialogDescription>
      </DialogHeader>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Excluir
        </Button>
      </div>
    </DialogContent>
  );
}
