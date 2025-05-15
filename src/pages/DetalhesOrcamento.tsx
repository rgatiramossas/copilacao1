
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import OrcamentoForm from '@/components/OrcamentoForm';
import { orcamentoService } from '@/services/orcamentoService';
import { OrcamentoActions } from '@/components/OrcamentoActions';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface DetalhesOrcamentoProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DetalhesOrcamento({ id, open, onOpenChange }: DetalhesOrcamentoProps) {
  const isMobile = useIsMobile();

  const { data: orcamento, isLoading, error } = useQuery({
    queryKey: ['orcamento', id],
    queryFn: () => orcamentoService.getOrcamentoById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle>Carregando orçamento...</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !orcamento) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
          <DialogHeader className="p-4 pb-2">
            <DialogTitle className="text-red-600">Erro ao carregar o orçamento</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <p className="text-gray-600 text-center px-4 mb-4">
              O orçamento solicitado não foi encontrado ou ocorreu um erro.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
        <DialogHeader className="p-4 pb-2 sticky top-0 bg-background z-10">
          <DialogTitle>Orçamento #{id}</DialogTitle>
          <div className="flex justify-end">
            <OrcamentoActions isNovo={false} />
          </div>
        </DialogHeader>
        <div className="overflow-auto h-[calc(95vh-4rem)]">
          <div className="min-w-[300px] sm:min-w-[800px] p-4 pt-2">
            <Card className="shadow-sm">
              <CardContent className={`${isMobile ? 'p-3' : 'p-6'}`}>
                <OrcamentoForm 
                  orcamentoId={id}
                  orcamento={orcamento}
                  isReadOnly={true}
                  onCancel={() => onOpenChange(false)}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
