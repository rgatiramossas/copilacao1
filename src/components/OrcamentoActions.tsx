
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, Euro } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface OrcamentoActionsProps {
  isNovo: boolean;
}

export function OrcamentoActions({ isNovo }: OrcamentoActionsProps) {
  const navigate = useNavigate();

  const handleImprimir = () => {
    toast.info("Preparando impressão...");
    // Em uma implementação real, aqui seria preparado o documento para impressão
    setTimeout(() => {
      toast.success("Documento enviado para impressão");
    }, 1500);
  };

  if (isNovo) {
    return null;
  }

  return (
    <div className="p-6 pb-0">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleImprimir}>
          <Printer className="mr-2 h-4 w-4" />
          Imprimir
        </Button>
        <Button variant="outline" onClick={() => navigate('/orcamentos')}>
          <Euro className="mr-2 h-4 w-4" />
          Todos Orçamentos
        </Button>
      </div>
    </div>
  );
}
