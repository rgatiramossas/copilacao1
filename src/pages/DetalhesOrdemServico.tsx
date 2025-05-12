import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AppLayout from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ordemServicoService } from '@/services/ordemServicoService';
import { clienteService } from '@/services/clienteService';
import { OrdemServico, Cliente } from '@/types';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Edit, Trash2, FileText } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import EditarOrdemServicoDialog from '@/components/EditarOrdemServicoDialog';
import { toast } from 'sonner';

const DetalhesOrdemServico = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { userRole } = useAuth();
  
  const [ordem, setOrdem] = useState<OrdemServico | null>(null);
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [dialogEditarAberta, setDialogEditarAberta] = useState(false);
  
  useEffect(() => {
    if (id) {
      const ordemEncontrada = ordemServicoService.getOrdemServicoById(id);
      if (ordemEncontrada) {
        setOrdem(ordemEncontrada);
        const clienteEncontrado = clienteService.getClienteById(ordemEncontrada.clienteId);
        setCliente(clienteEncontrado || null);
      }
      setCarregando(false);
    }
  }, [id]);
  
  if (carregando) {
    return (
      <AppLayout>
        <div className="flex justify-center items-center h-56">
          <p>Carregando dados da OS...</p>
        </div>
      </AppLayout>
    );
  }
  
  if (!ordem) {
    return (
      <AppLayout>
        <div className="text-center p-10 bg-white rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">Ordem de Serviço não encontrada</h2>
          <p className="text-gray-500 mb-4">A ordem de serviço solicitada não existe ou foi removida.</p>
          <Button onClick={() => navigate('/ordens-servico')}>Voltar para Lista de OS</Button>
        </div>
      </AppLayout>
    );
  }
  
  const formatarData = (dataString?: string) => {
    if (!dataString) return '-';
    try {
      return format(parseISO(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (error) {
      return 'Data inválida';
    }
  };
  
  const getStatusLabel = (status: OrdemServico['status']) => {
    switch (status) {
      case 'aberta': return 'Aberta';
      case 'em_andamento': return 'Em Andamento';
      case 'concluida': return 'Concluída';
      case 'cancelada': return 'Cancelada';
      default: return status;
    }
  };
  
  const getStatusClassName = (status: OrdemServico['status']) => {
    switch (status) {
      case 'aberta': return 'bg-blue-500 hover:bg-blue-600';
      case 'em_andamento': return 'bg-amber-500 hover:bg-amber-600';
      case 'concluida': return 'bg-green-500 hover:bg-green-600';
      case 'cancelada': return 'bg-red-500 hover:bg-red-600';
      default: return 'bg-gray-500';
    }
  };
  
  const formatarPreco = (preco?: number) => {
    return preco ? `€${preco.toFixed(2)}` : '-';
  };
  
  const handleEditar = () => {
    setDialogEditarAberta(true);
  };
  
  const handleExcluir = () => {
    if (window.confirm('Tem certeza que deseja excluir esta ordem de serviço?')) {
      if (id && ordemServicoService.removeOrdemServico(id)) {
        toast.success('Ordem de serviço excluída com sucesso!');
        navigate('/ordens-servico');
      } else {
        toast.error('Erro ao excluir a ordem de serviço');
      }
    }
  };
  
  const onOSAtualizada = (osAtualizada: OrdemServico) => {
    setOrdem(osAtualizada);
    setDialogEditarAberta(false);
    toast.success('Ordem de serviço atualizada com sucesso!');
  };
  
  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <FileText className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">OS #{ordem.id}</h1>
          <Badge className={`ml-3 ${getStatusClassName(ordem.status)}`}>
            {getStatusLabel(ordem.status)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEditar}>
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleExcluir}>
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Data de Abertura</p>
              <p className="font-medium">{formatarData(ordem.dataAbertura)}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Tipo de Serviço</p>
              <p className="font-medium">{ordem.tipoServico}</p>
            </div>
            
            {ordem.dataEncerramento && (
              <div>
                <p className="text-sm text-muted-foreground">Data de Encerramento</p>
                <p className="font-medium">{formatarData(ordem.dataEncerramento)}</p>
              </div>
            )}
            
            <div>
              <p className="text-sm text-muted-foreground">Preço Técnico</p>
              <p className="font-medium">{formatarPreco(ordem.precoTecnico)}</p>
            </div>
            
            {userRole === 'administrador' && (
              <div>
                <p className="text-sm text-muted-foreground">Preço Administrativo</p>
                <p className="font-medium">{formatarPreco(ordem.precoAdministrativo)}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dados do Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cliente ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{cliente.nome}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium">{cliente.telefone || '-'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{cliente.email || '-'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{cliente.endereco}</p>
                  <p>{cliente.cidade}, {cliente.estado}, {cliente.cep}</p>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full mt-2"
                  onClick={() => navigate(`/clientes/${cliente.id}`)}
                >
                  Ver Perfil Completo
                </Button>
              </>
            ) : (
              <p>Cliente não encontrado</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Dados do Veículo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Veículo</p>
                <p className="font-medium">{ordem.veiculo}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Placa</p>
                <p className="font-medium">{ordem.placa || '-'}</p>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">Chassi</p>
                <p className="font-medium">{ordem.chassi || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Observações</CardTitle>
          </CardHeader>
          <CardContent>
            {ordem.observacoes ? (
              <p className="whitespace-pre-line">{ordem.observacoes}</p>
            ) : (
              <p className="text-muted-foreground">Nenhuma observação registrada.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Fotos</CardTitle>
            <CardDescription>Galeria de fotos do serviço</CardDescription>
          </CardHeader>
          <CardContent>
            {ordem.fotos && ordem.fotos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {ordem.fotos.map((foto, index) => (
                  <div key={index} className="relative aspect-square overflow-hidden rounded-md border">
                    <img
                      src={foto}
                      alt={`Foto ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">Nenhuma foto disponível.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <EditarOrdemServicoDialog
        isOpen={dialogEditarAberta}
        onClose={() => setDialogEditarAberta(false)}
        ordem={ordem}
        onSucesso={onOSAtualizada}
      />
    </AppLayout>
  );
};

export default DetalhesOrdemServico;
