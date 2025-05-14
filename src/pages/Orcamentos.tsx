
import { useState } from 'react';
import { Eye, Printer, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

import { orcamentoService } from '@/services/orcamentoService';
import { clienteService } from '@/services/clienteService';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell
} from '@/components/ui/table';
import { Dialog } from '@/components/ui/dialog';
import { OrcamentoDetalhado } from '@/types';
import { OrcamentoItem } from '@/components/OrcamentoItem';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';

export default function Orcamentos() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orcamentoParaExcluir, setOrcamentoParaExcluir] = useState<string | null>(null);

  // Title will be shown in AppLayout
  document.title = "Orçamentos";

  const { data: orcamentos = [], refetch } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => orcamentoService.getOrcamentos(),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getClientes(),
  });

  const handleVerDetalhes = (id: string) => {
    navigate(`/orcamentos/${id}`);
  };

  const handleImprimir = (orcamento: OrcamentoDetalhado) => {
    toast.info("Preparando impressão...");
    // Em uma implementação real, aqui seria preparado o documento para impressão
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

  const handleNovoOrcamento = () => {
    navigate('/orcamentos/novo');
  };

  return (
    <AppLayout>
      <div className="px-6 pt-2">
        <div className="flex justify-end items-center mb-6">
          <Button onClick={handleNovoOrcamento}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>

        <div className="rounded-md border">
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

      {/* Diálogo de confirmação para exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <ConfirmDeleteDialog 
          onConfirm={confirmarExclusao}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      </Dialog>
    </AppLayout>
  );
}
