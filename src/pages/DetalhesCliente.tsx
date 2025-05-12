
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { clienteService } from '@/services/clienteService';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Cliente } from '@/types';

const DetalhesCliente = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (id) {
      const clienteEncontrado = clienteService.getClienteById(id);
      if (clienteEncontrado) {
        setCliente(clienteEncontrado);
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-2">Cliente não encontrado</h2>
        <p className="text-gray-600 mb-4">O cliente solicitado não existe ou foi removido.</p>
        <Button onClick={() => navigate('/clientes')}>Voltar para lista</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{cliente.nome}</h2>
        <Button variant="outline" onClick={() => navigate('/clientes')}>
          Voltar
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Nome</dt>
              <dd className="mt-1 text-base">{cliente.nome}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Telefone</dt>
              <dd className="mt-1 text-base">{cliente.telefone || 'Não informado'}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Email</dt>
              <dd className="mt-1 text-base">{cliente.email || 'Não informado'}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Endereço</dt>
              <dd className="mt-1 text-base">{cliente.endereco}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">Cidade/Estado</dt>
              <dd className="mt-1 text-base">{cliente.cidade}, {cliente.estado}</dd>
            </div>
            
            <div>
              <dt className="text-sm font-medium text-gray-500">CEP</dt>
              <dd className="mt-1 text-base">{cliente.cep || 'Não informado'}</dd>
            </div>
          </dl>

          {cliente.observacoes && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-500">Observações</h3>
              <p className="mt-1 text-base">{cliente.observacoes}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Atendimento</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            Nenhum atendimento registrado para este cliente.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DetalhesCliente;
