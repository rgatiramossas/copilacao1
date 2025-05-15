
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import OrcamentoForm from '@/components/OrcamentoForm';
import { orcamentoService } from '@/services/orcamentoService';
import { Button } from '@/components/ui/button';
import { OrcamentoActions } from '@/components/OrcamentoActions';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

export default function DetalhesOrcamento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNovo = id === 'novo';
  const isMobile = useIsMobile();

  const { data: orcamento, isLoading, error } = useQuery({
    queryKey: ['orcamento', id],
    queryFn: () => isNovo ? null : orcamentoService.getOrcamentoById(id!),
    enabled: !isNovo && !!id,
  });

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="flex justify-center items-center h-64">
            <p className="text-muted-foreground">Carregando orçamento...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || (!orcamento && !isNovo)) {
    return (
      <div className="p-4 md:p-6">
        <Card>
          <CardContent className="flex flex-col justify-center items-center h-64 space-y-4">
            <h2 className="text-xl font-bold text-red-600">
              Erro ao carregar o orçamento
            </h2>
            <p className="text-gray-600 text-center px-4">
              O orçamento solicitado não foi encontrado ou ocorreu um erro.
            </p>
            <Button onClick={() => navigate('/orcamentos')}>
              Voltar para Orçamentos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`h-full overflow-auto p-4 md:p-6 space-y-4 ${isMobile ? 'max-w-full' : 'max-w-6xl mx-auto'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">
          {isNovo ? 'Novo Orçamento' : `Orçamento #${id}`}
        </h1>
        <OrcamentoActions isNovo={isNovo} />
      </div>
      
      <Card className="shadow-sm">
        <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
          <OrcamentoForm 
            orcamentoId={isNovo ? undefined : id} 
            isReadOnly={!isNovo}
            onCancel={() => navigate('/orcamentos')}
          />
        </CardContent>
      </Card>
    </div>
  );
}
