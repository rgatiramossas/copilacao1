
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { ordemServicoService } from '@/services/ordemServicoService';
import { OrdemServico } from '@/types';
import NovaOrdemServicoDialog from '@/components/NovaOrdemServicoDialog';
import { Badge } from '@/components/ui/badge';

const StatusBadge = ({ status }: { status: OrdemServico['status'] }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'aberta':
        return { label: 'Aberta', className: 'bg-blue-500 hover:bg-blue-600' };
      case 'em_andamento':
        return { label: 'Em Andamento', className: 'bg-amber-500 hover:bg-amber-600' };
      case 'concluida':
        return { label: 'Concluída', className: 'bg-green-500 hover:bg-green-600' };
      case 'cancelada':
        return { label: 'Cancelada', className: 'bg-red-500 hover:bg-red-600' };
      default:
        return { label: status, className: 'bg-gray-500 hover:bg-gray-600' };
    }
  };

  const config = getStatusConfig();
  
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  );
};

const OrdensServico = () => {
  const [dialogAberta, setDialogAberta] = useState(false);
  const [ordens, setOrdens] = useState<OrdemServico[]>(ordemServicoService.getOrdensServico());
  const navigate = useNavigate();

  const abrirNovaOSDialog = () => setDialogAberta(true);
  const fecharNovaOSDialog = () => setDialogAberta(false);

  const onOSCriada = (novaOS: OrdemServico) => {
    setOrdens([...ordens, novaOS]);
    fecharNovaOSDialog();
  };

  const formatarData = (dataString: string) => {
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Ordens de Serviço</h1>
        <Button onClick={abrirNovaOSDialog}>
          <Plus className="mr-2 h-4 w-4" />
          Nova OS
        </Button>
      </div>

      {ordens.length === 0 ? (
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 mb-4">Nenhuma ordem de serviço encontrada</p>
          <Button onClick={abrirNovaOSDialog}>Criar Primeira OS</Button>
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
                  <TableCell>
                    {/* Aqui colocaríamos o nome do cliente, mas como é um mock, vamos usar um placeholder */}
                    Cliente {ordem.clienteId}
                  </TableCell>
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
        onClose={fecharNovaOSDialog} 
        onSucesso={onOSCriada} 
      />
    </AppLayout>
  );
};

export default OrdensServico;
