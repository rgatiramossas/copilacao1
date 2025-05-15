import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Eye, Plus, Printer, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { orcamentoService } from '@/services/orcamentoService';
import { clienteService } from '@/services/clienteService';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { OrcamentoItem } from '@/components/OrcamentoItem';
import { ConfirmDeleteDialog } from '@/components/ConfirmDeleteDialog';
import { Card, CardContent } from '@/components/ui/card';
import OrcamentoForm from '@/components/OrcamentoForm';
import { Badge } from '@/components/ui/badge';
import { OrcamentoDetalhado } from '@/types';
import DetalhesOrcamento from './DetalhesOrcamento';

export default function Orcamentos() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orcamentoParaExcluir, setOrcamentoParaExcluir] = useState<string | null>(null);
  const { modalOpen } = useParams();

  document.title = "Orçamentos";

  const { data: orcamentos = [], refetch } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => orcamentoService.getOrcamentos(),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getClientes(),
  });

  const [selectedOrcamentoId, setSelectedOrcamentoId] = useState<string | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (modalOpen === 'novo') {
      setSelectedOrcamentoId(undefined);
      setIsModalOpen(true);
    } else if (modalOpen) {
      setSelectedOrcamentoId(modalOpen);
      setIsModalOpen(true);
    }
  }, [modalOpen]);


  const handleNovoOrcamento = () => {
    setSelectedOrcamentoId(undefined);
    setIsModalOpen(true);
  }
  const handleVerDetalhes = (id: string) => {
    setSelectedOrcamentoId(id);
    setIsModalOpen(true);
  };

  // Updated to accept OrcamentoDetalhado instead of Orcamento
  const handleImprimir = (orcamento?: OrcamentoDetalhado) => {
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
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Orçamentos</h1>
        <Button onClick={handleNovoOrcamento} className="w-full sm:w-auto bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Novo Orçamento
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orcamentos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32">
            <p className="text-gray-500 mb-2">Nenhum orçamento encontrado</p>
            <Button variant="outline" onClick={handleNovoOrcamento} className="mt-2">
              Criar primeiro orçamento
            </Button>
          </div>
        ) : (
          <>
            <div className="md:hidden space-y-4 p-4">
              {orcamentos.map((orcamento) => (
                <Card key={orcamento.id} className="hover:bg-gray-50 transition-colors">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">Data: {format(new Date(orcamento.data), "dd/MM/yyyy", { locale: ptBR })}</p>
                        <p className="text-sm text-muted-foreground">
                          Cliente: {clientes.find(c => c.id === orcamento.clienteId)?.nome || 'Cliente não encontrado'}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {orcamento.precoEuro.toLocaleString('pt-BR', { style: 'currency', currency: 'EUR' })}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm">
                      <p><span className="text-muted-foreground">Veículo:</span> {orcamento.veiculo}</p>
                      <p><span className="text-muted-foreground">Placa/Chassi:</span> {orcamento.placa || orcamento.chassi}</p>
                      <p><span className="text-muted-foreground">Total AW:</span> {orcamento.totalAW}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleVerDetalhes(orcamento.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleImprimir(orcamento)}>
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleExcluir(orcamento.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="hidden md:block">
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
                  {orcamentos.map((orcamento) => (
                    <OrcamentoItem
                      key={orcamento.id}
                      orcamento={orcamento}
                      clientes={clientes}
                      onVerDetalhes={handleVerDetalhes}
                      onImprimir={handleImprimir}
                      onExcluir={handleExcluir}
                    />
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <ConfirmDeleteDialog
          onConfirm={confirmarExclusao}
          onCancel={() => setIsDeleteDialogOpen(false)}
        />
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
          <DialogHeader className="p-4 pb-2 sticky top-0 bg-background z-10">
            <DialogTitle>{selectedOrcamentoId ? 'Detalhes do Orçamento' : 'Novo Orçamento'}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto h-[calc(95vh-4rem)]">
            <div className="min-w-[300px] sm:min-w-[800px] p-4 pt-2">
              {selectedOrcamentoId ? (
                <DetalhesOrcamento orcamentoId={selectedOrcamentoId} onClose={() => setIsModalOpen(false)} />
              ) : (
                <OrcamentoForm onCancel={() => setIsModalOpen(false)} />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}