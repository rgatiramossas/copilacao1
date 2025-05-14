
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import OrcamentoForm from '@/components/OrcamentoForm';
import AppLayout from '@/components/AppLayout';
import { orcamentoService } from '@/services/orcamentoService';
import { Button } from '@/components/ui/button';
import { OrcamentoActions } from '@/components/OrcamentoActions';

export default function DetalhesOrcamento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNovo = id === 'novo';

  const { data: orcamento, isLoading, error } = useQuery({
    queryKey: ['orcamento', id],
    queryFn: () => isNovo ? null : orcamentoService.getOrcamentoById(id!),
    enabled: !isNovo && !!id,
  });

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
      <OrcamentoActions isNovo={isNovo} />
      
      <OrcamentoForm 
        orcamentoId={isNovo ? undefined : id} 
        isReadOnly={!isNovo}
      />
    </AppLayout>
  );
}
