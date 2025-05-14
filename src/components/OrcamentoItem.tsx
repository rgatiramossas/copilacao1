
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Printer, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { OrcamentoDetalhado } from '@/types';

interface OrcamentoItemProps {
  orcamento: OrcamentoDetalhado;
  clientes: any[];
  onVerDetalhes: (id: string) => void;
  onImprimir: (orcamento: OrcamentoDetalhado) => void;
  onExcluir: (id: string) => void;
}

export function OrcamentoItem({ orcamento, clientes, onVerDetalhes, onImprimir, onExcluir }: OrcamentoItemProps) {
  const formatarData = (dataString: string) => {
    try {
      return format(new Date(dataString), "dd/MM/yyyy", { locale: ptBR });
    } catch (error) {
      return "Data inválida";
    }
  };

  const getNomeCliente = (clienteId: string) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente ? cliente.nome : 'Cliente não encontrado';
  };
  
  return (
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
            onClick={() => onVerDetalhes(orcamento.id)}
            title="Ver detalhes"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onImprimir(orcamento)}
            title="Imprimir"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onExcluir(orcamento.id)}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
