
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

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

  // Definir título da página
  document.title = "Orçamentos";

  // Consultas
  const { data: orcamentos = [], refetch } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => orcamentoService.getOrcamentos(),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getClientes(),
  });

  // Handlers
  const handleNovoOrcamento = () => navigate('/orcamentos/novo');

  const handleVerDetalhes = (id: string) => navigate(`/orcamentos/${id}`);

  const handleImprimir = () => {
    toast.info("Preparando impressão...");
    setTimeout(() => toast.success("Documento enviado para impressão"), 1500);
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
          <Button 
            onClick={handleNovoOrcamento}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Orçamento
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow">
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
                  <TableCell colSpan={7} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-gray-500 mb-2">Nenhum orçamento encontrado</p>
                      <Button 
                        variant="outline" 
                        onClick={handleNovoOrcamento}
                        className="mt-2"
                      >
                        Criar primeiro orçamento
                      </Button>
                    </div>
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
    </div>
  );
}
