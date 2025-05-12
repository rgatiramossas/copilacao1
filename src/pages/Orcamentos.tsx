
import { useState } from 'react';
import { Eye, Printer, Trash2, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { OrcamentoDetalhado } from '@/types';

export default function Orcamentos() {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [orcamentoParaExcluir, setOrcamentoParaExcluir] = useState<string | null>(null);

  const { data: orcamentos = [], refetch } = useQuery({
    queryKey: ['orcamentos'],
    queryFn: () => orcamentoService.getOrcamentos(),
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes'],
    queryFn: () => clienteService.getClientes(),
  });

  const getNomeCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };

  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

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
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Orçamentos</h1>
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
                  <TableRow key={orcamento.id}>
                    <TableCell>{formatarData(orcamento.data)}</TableCell>
                    <TableCell>{getNomeCliente(orcamento.clienteId)}</TableCell>
                    <TableCell>{orcamento.veiculo}</TableCell>
                    <TableCell>{orcamento.placa || orcamento.chassi}</TableCell>
                    <TableCell>{orcamento.totalAW}</TableCell>
                    <TableCell>{orcamento.precoEuro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleVerDetalhes(orcamento.id)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleImprimir(orcamento)}
                          title="Imprimir"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleExcluir(orcamento.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir este orçamento? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmarExclusao}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}
