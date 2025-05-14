
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { orcamentoService } from '@/services/orcamentoService';
import { clienteService } from '@/services/clienteService';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { OrcamentoItem } from '@/components/OrcamentoItem';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';

export default function Orcamentos() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orcamentoParaExcluir, setOrcamentoParaExcluir] = useState<string | null>(null);

  document.title = "Orçamentos";

  const { data: orcamentos = [], refetch } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => orcamentoService.getOrcamentos(),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getClientes(),
  });

  const handleNovoOrcamento = () => {
    navigate('/orcamentos/novo');
  };

  const handleVerDetalhes = (id: string) => {
    navigate(`/orcamentos/${id}`);
  };

  const handleImprimir = () => {
    toast.info("Preparando impressão...");
    setTimeout(() => {
      toast.success("Documento enviado para impressão");
    }, 1500);
  };

  const handleExcluir = (id: string) => {
    setOrcamentoParaExcluir(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmarExclusao = () => {
    if (orcamentoParaExcluir) {
      const resultado = orcamentoService.removeOrcamento(orcamentoParaExcluir);
      if (resultado) {
        toast.success("Orçamento excluído com sucesso!");
        refetch();
      } else {
        toast.error("Erro ao excluir orçamento.");
      }
    }
    setIsDeleteDialogOpen(false);
    setOrcamentoParaExcluir(null);
  };

  return (
    <AppLayout>
      <div className="flex-1 p-4 md:p-8">
        <div className="flex justify-end mb-6">
          <Button onClick={handleNovoOrcamento}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>

        <div className="rounded-md border bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Placa/Chassi</TableHead>
                <TableHead>Total AW</TableHead>
                <TableHead>Valor (€)</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orcamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Nenhum orçamento encontrado.
                  </TableCell>
                </TableRow>
              ) : (
                orcamentos.map((orcamento) => (
                  <OrcamentoItem 
                    key={orcamento.id}
                    orcamento={orcamento}
                    clientes={clientes}
                    onVerDetalhes={handleVerDetalhes}
                    onImprimir={handleImprimir}
                    onExcluir={handleExcluir}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <ConfirmDeleteDialog 
          onConfirm={confirmarExclusao}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      </Dialog>
    </AppLayout>
  );
}
