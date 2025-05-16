
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Printer, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface OrcamentoActionsProps {
  isNovo: boolean;
  orcamentoId?: string;
  onPrintPreview?: () => void;
}

export function OrcamentoActions({ isNovo, orcamentoId, onPrintPreview }: OrcamentoActionsProps) {
  const navigate = useNavigate();

  const handlePrintPreview = () => {
    if (onPrintPreview) {
      onPrintPreview();
    } else {
      toast.info("Preparando visualização do PDF...");
    }
  };

  if (isNovo) {
    return null;
  }

  return (
    <div className="p-6 pb-0">
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handlePrintPreview}>
          <Printer className="mr-2 h-4 w-4" />
          Visualizar PDF
        </Button>
        <Button variant="outline" onClick={() => navigate('/orcamentos')}>
          <FileText className="mr-2 h-4 w-4" />
          Todos Orçamentos
        </Button>
      </div>
    </div>
  );
}
