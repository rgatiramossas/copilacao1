
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import NovaOrdemServicoDialog from '@/components/NovaOrdemServicoDialog';
import { ordemServicoService } from '@/services/ordemServicoService';
import { OrdemServico, StatusOS } from '@/types';

const StatusBadge = ({ status }: { status: StatusOS }) => {
  const statusConfig = {
    em_andamento: { label: 'Em Andamento', className: 'bg-amber-500' },
    concluido: { label: 'Concluído', className: 'bg-green-500' },
    em_aprovacao: { label: 'Em Aprovação', className: 'bg-purple-500' },
    aprovado: { label: 'Aprovado', className: 'bg-blue-500' },
    faturado: { label: 'Faturado', className: 'bg-cyan-500' },
    pago: { label: 'Pago', className: 'bg-lime-500' },
    cancelado: { label: 'Cancelado', className: 'bg-red-500' }
  }[status] || { label: status, className: 'bg-gray-500' };

  return (
    <Badge className={statusConfig.className}>
      {statusConfig.label}
    </Badge>
  );
};

const OrdensServico = () => {
  const [dialogAberta, setDialogAberta] = useState(false);
  const [ordens, setOrdens] = useState<OrdemServico[]>(ordemServicoService.getOrdensServico());
  const navigate = useNavigate();

  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ordens de Serviço</h1>
        <Button onClick={() => setDialogAberta(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova OS
        </Button>
      </div>

      {ordens.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Nenhuma ordem de serviço encontrada</p>
          <Button onClick={() => setDialogAberta(true)}>Criar Primeira OS</Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Veículo</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordens.map((ordem) => (
                <TableRow key={ordem.id}>
                  <TableCell>{ordem.id}</TableCell>
                  <TableCell>{formatarData(ordem.dataAbertura)}</TableCell>
                  <TableCell>Cliente {ordem.clienteId}</TableCell>
                  <TableCell>{ordem.veiculo}</TableCell>
                  <TableCell>{ordem.tipoServico}</TableCell>
                  <TableCell>
                    <StatusBadge status={ordem.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/ordens-servico/${ordem.id}`)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver Detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <NovaOrdemServicoDialog 
        isOpen={dialogAberta} 
        onClose={() => setDialogAberta(false)} 
        onSucesso={(novaOS) => {
          setOrdens([...ordens, novaOS]);
          setDialogAberta(false);
        }} 
      />
    </div>
  );
};

export default OrdensServico;
