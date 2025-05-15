
import { useQuery } from '@tanstack/react-query';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrcamentoForm from '@/components/OrcamentoForm';
import { orcamentoService } from '@/services/orcamentoService';
import { Button } from '@/components/ui/button';
import { OrcamentoActions } from '@/components/OrcamentoActions';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface DetalhesOrcamentoProps {
  id?: string;
  onClose: () => void;
}

export default function DetalhesOrcamento({ id, onClose }: DetalhesOrcamentoProps) {
  const isNovo = !id;
  const isMobile = useIsMobile();

  const { data: orcamento, isLoading, error } = useQuery({
    queryKey: ['orcamento', id],
    queryFn: () => isNovo ? null : orcamentoService.getOrcamentoById(id!),
    enabled: !isNovo && !!id,
  });

  if (isLoading) {
    return (
      <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle>Carregando orçamento...</DialogTitle>
        </DialogHeader>
      </DialogContent>
    );
  }

  if (error || (!orcamento && !isNovo)) {
    return (
      <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
        <DialogHeader className="p-4 pb-2">
          <DialogTitle className="text-red-600">Erro ao carregar o orçamento</DialogTitle>
        </DialogHeader>
        <div className="p-4">
          <p className="text-gray-600 text-center px-4 mb-4">
            O orçamento solicitado não foi encontrado ou ocorreu um erro.
          </p>
          <Button onClick={onClose}>Fechar</Button>
        </div>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
      <DialogHeader className="p-4 pb-2 sticky top-0 bg-background z-10">
        <DialogTitle>
          {isNovo ? 'Novo Orçamento' : `Orçamento #${id}`}
        </DialogTitle>
        <div className="flex justify-end">
          <OrcamentoActions isNovo={isNovo} />
        </div>
      </DialogHeader>
      
      <div className="overflow-auto h-[calc(95vh-4rem)]">
        <div className="min-w-[300px] sm:min-w-[800px] p-4 pt-2">
          <Card className="shadow-sm">
            <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
              <OrcamentoForm 
                orcamentoId={isNovo ? undefined : id} 
                isReadOnly={!isNovo}
                onCancel={onClose}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </DialogContent>
  );
}
