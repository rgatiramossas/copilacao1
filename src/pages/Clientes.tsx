
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { clienteService } from '@/services/clienteService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import AdicionarClienteForm from '@/components/AdicionarClienteForm';
import { Card, CardContent } from '@/components/ui/card';

const Clientes = () => {
  const navigate = useNavigate();
  const [busca, setBusca] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);
  const [clientesData, setClientesData] = useState(clienteService.getClientes());

  const clientesFiltrados = clientesData.filter(cliente => 
    cliente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(busca.toLowerCase()) ||
    cliente.telefone?.toLowerCase().includes(busca.toLowerCase())
  );

  const handleAdicionarCliente = () => {
    setDialogAberto(true);
  };

  const atualizarListaClientes = () => {
    setClientesData(clienteService.getClientes());
    setDialogAberto(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar clientes..."
            className="pl-8 w-full"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
        <Button onClick={handleAdicionarCliente} className="whitespace-nowrap">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Cliente
        </Button>
      </div>

      {/* Lista de clientes em cards para mobile e tabela para desktop */}
      <div className="md:hidden space-y-4">
        {clientesFiltrados.map((cliente) => (
          <Card key={cliente.id} className="hover:bg-gray-50 transition-colors">
            <CardContent className="p-4">
              <div className="space-y-2">
                <h3 className="font-medium">{cliente.nome}</h3>
                <div className="text-sm text-muted-foreground">
                  <p>{cliente.telefone || '-'}</p>
                  <p>{cliente.email || '-'}</p>
                  <p>{cliente.cidade}, {cliente.estado}</p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => navigate(`/clientes/${cliente.id}`)}
                >
                  Ver Cliente
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {clientesFiltrados.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            Nenhum cliente encontrado.
          </div>
        )}
      </div>

      {/* Tabela para desktop */}
      <div className="hidden md:block rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Localização</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clientesFiltrados.length > 0 ? (
              clientesFiltrados.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell className="font-medium">{cliente.nome}</TableCell>
                  <TableCell>{cliente.telefone || '-'}</TableCell>
                  <TableCell>{cliente.email || '-'}</TableCell>
                  <TableCell>{cliente.cidade}, {cliente.estado}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/clientes/${cliente.id}`)}
                    >
                      Ver Cliente
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Nenhum cliente encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
          </DialogHeader>
          <AdicionarClienteForm onSucesso={atualizarListaClientes} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Clientes;
