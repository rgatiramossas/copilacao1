
import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit, Trash2, Printer } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import OrcamentoForm from '@/components/OrcamentoForm';
import { orcamentoService } from '@/services/orcamentoService';
import { clienteService } from '@/services/clienteService';
import { OrcamentoPDFHeader } from '@/components/OrcamentoPDF/OrcamentoPDFHeader';

interface DetalhesOrcamentoProps {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DetalhesOrcamento({ id, open, onOpenChange }: DetalhesOrcamentoProps) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isPrintPreview, setIsPrintPreview] = useState(false);
  const queryClient = useQueryClient();

  const { data: orcamento, isLoading, error } = useQuery({
    queryKey: ['orcamento', id],
    queryFn: () => orcamentoService.getOrcamentoById(id),
    enabled: !!id,
  });

  const { data: cliente } = useQuery({
    queryKey: ['cliente', orcamento?.clienteId],
    queryFn: () => clienteService.getClienteById(orcamento?.clienteId || ''),
    enabled: !!orcamento?.clienteId,
  });

  const handleEditClick = () => {
    setIsEditing(prev => !prev);
  };

  const handleExcluir = () => {
    if (window.confirm('Tem certeza que deseja excluir este orçamento?')) {
      const resultado = orcamentoService.removeOrcamento(id);
      if (resultado) {
        toast.success("Orçamento excluído com sucesso!");
        onOpenChange(false);
        navigate('/orcamentos');
      } else {
        toast.error("Erro ao excluir orçamento.");
      }
    }
  };

  const handlePrintPreview = () => {
    setIsPrintPreview(true);
  };

  const formatarData = (dataString?: string) => {
    if (!dataString) return '-';
    try {
      return format(new Date(dataString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  const formatarPreco = (preco?: number) => preco ? `€${preco.toFixed(2)}` : '-';

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
          <div className="flex justify-center items-center h-full">
            <p>Carregando orçamento...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !orcamento) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
          <div className="p-4">
            <p className="text-red-600 font-semibold">Erro ao carregar o orçamento</p>
            <p className="text-gray-600 text-center px-4 mt-2">
              O orçamento solicitado não foi encontrado ou ocorreu um erro.
            </p>
            <div className="flex justify-center mt-4">
              <Button onClick={() => onOpenChange(false)}>Voltar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (isPrintPreview) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
          <div className="p-6 bg-white">
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                onClick={() => setIsPrintPreview(false)}
                className="mr-2"
              >
                Voltar
              </Button>
              <Button onClick={() => window.print()}>
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
            </div>
            <div className="max-w-4xl mx-auto bg-white p-8 shadow-sm border print:shadow-none print:border-none">
              <OrcamentoPDFHeader
                numeroDoPedido={id}
                data={formatarData(orcamento.data)}
                clienteNome={cliente?.nome || 'Cliente não encontrado'}
                veiculo={orcamento.veiculo}
                placa={orcamento.placa}
                chassi={orcamento.chassi}
              />
              
              {/* Conteúdo adicional do PDF será adicionado aqui */}
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-4">Detalhes do Orçamento</h2>
                {/* Detalhes e itens do orçamento serão adicionados nas próximas etapas */}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[95%] lg:max-w-[90%] xl:max-w-[1400px] h-[95vh] p-0">
        <div className="overflow-auto h-full p-6">
          <div className="container mx-auto space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  <h1 className="text-2xl font-bold">Orçamento #{id}</h1>
                </div>
                <Badge variant="outline" className="bg-blue-500 text-white">
                  {formatarPreco(orcamento.precoEuro)}
                </Badge>
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <Button variant="outline" onClick={handlePrintPreview}>
                  <Printer className="h-4 w-4 mr-2" />
                  Visualizar PDF
                </Button>
                <Button onClick={handleEditClick}>
                  <Edit className="h-4 w-4 mr-2" />
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
                <Button variant="destructive" onClick={handleExcluir}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            {isEditing ? (
              <Card>
                <CardContent className="p-6">
                  <OrcamentoForm 
                    orcamentoId={id}
                    orcamento={orcamento}
                    isReadOnly={false}
                    onCancel={() => setIsEditing(false)}
                    onSave={() => {
                      setIsEditing(false);
                      queryClient.invalidateQueries({ queryKey: ['orcamento', id] });
                      toast.success('Orçamento atualizado com sucesso!');
                    }}
                  />
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Informações Básicas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Data</p>
                      <p className="font-medium">{formatarData(orcamento.data)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total AW</p>
                      <p className="font-medium">{orcamento.totalAW}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valor Total (Euro)</p>
                      <p className="font-medium">{formatarPreco(orcamento.precoEuro)}</p>
                    </div>
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
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            onOpenChange(false);
                            navigate(`/clientes/${cliente.id}`);
                          }}
                        >
                          Ver Perfil Completo
                        </Button>
                      </>
                    ) : (
                      <p className="text-muted-foreground">Cliente não encontrado</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Dados do Veículo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Veículo</p>
                        <p className="font-medium">{orcamento.veiculo}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Placa</p>
                        <p className="font-medium">{orcamento.placa || '-'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Chassi</p>
                        <p className="font-medium">{orcamento.chassi || '-'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Observações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {orcamento.observacoes ? (
                      <p className="whitespace-pre-line">{orcamento.observacoes}</p>
                    ) : (
                      <p className="text-muted-foreground">Nenhuma observação registrada.</p>
                    )}
                  </CardContent>
                </Card>

                {orcamento.itens && orcamento.itens.length > 0 && (
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Itens do Orçamento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border rounded-md overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="p-2 text-left font-medium">Descrição</th>
                              <th className="p-2 text-center font-medium">Quantidade</th>
                              <th className="p-2 text-right font-medium">Valor</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {orcamento.itens.map((item: any, index: number) => (
                              <tr key={index}>
                                <td className="p-2">{item.descricao}</td>
                                <td className="p-2 text-center">{item.quantidade}</td>
                                <td className="p-2 text-right">{formatarPreco(item.valor)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
