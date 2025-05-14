
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Printer, Euro } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import OrcamentoForm from '@/components/OrcamentoForm';
import AppLayout from '@/components/AppLayout';
import { orcamentoService } from '@/services/orcamentoService';

export default function DetalhesOrcamento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNovo = id === 'novo';

  const { data: orcamento, isLoading, error } = useQuery({
    queryKey: ['orcamento', id],
    queryFn: () => isNovo ? null : orcamentoService.getOrcamentoById(id!),
    enabled: !isNovo && !!id,
  });

  const handleImprimir = () => {
    toast.info("Preparando impressão...");
    // Em uma implementação real, aqui seria preparado o documento para impressão
    setTimeout(() => {
      toast.success("Documento enviado para impressão");
    }, 1500);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="flex justify-center items-center h-64">
            <p>Carregando orçamento...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (error || (!orcamento && !isNovo)) {
    return (
      <AppLayout>
        <div className="p-6">
          <div className="flex flex-col justify-center items-center h-64">
            <h2 className="text-xl font-bold text-red-600">
              Erro ao carregar o orçamento
            </h2>
            <p className="text-gray-600 mb-4">
              O orçamento solicitado não foi encontrado ou ocorreu um erro.
            </p>
            <Button onClick={() => navigate('/orcamentos')}>
              Voltar para Orçamentos
            </Button>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {!isNovo && (
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
      )}
      
      <OrcamentoForm 
        orcamentoId={isNovo ? undefined : id} 
        isReadOnly={!isNovo}
      />
    </AppLayout>
  );
}
