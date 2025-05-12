
import { Cliente } from '@/types';

// Array de clientes para mock (temporário até implementarmos backend)
let clientes: Cliente[] = [
  {
    id: '1',
    nome: 'Empresa ABC Ltda',
    telefone: '(11) 98765-4321',
    email: 'contato@empresaabc.com.br',
    endereco: 'Av. Paulista, 1000',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01310-000',
    observacoes: 'Cliente desde 2020'
  },
  {
    id: '2',
    nome: 'Restaurante Sabor & Cia',
    telefone: '(11) 91234-5678',
    email: 'atendimento@saborecia.com.br',
    endereco: 'Rua Augusta, 500',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01305-000',
    observacoes: 'Atendimento prioritário'
  },
  {
    id: '3',
    nome: 'Clínica Saúde Total',
    telefone: '(11) 97777-8888',
    email: 'agendamento@clinicasaude.com.br',
    endereco: 'Rua Oscar Freire, 200',
    cidade: 'São Paulo',
    estado: 'SP',
    cep: '01426-000'
  }
];

// Funções do serviço de clientes
export const clienteService = {
  // Obter todos os clientes
  getClientes: (): Cliente[] => {
    return [...clientes];
  },

  // Obter um cliente pelo ID
  getClienteById: (id: string): Cliente | undefined => {
    return clientes.find(cliente => cliente.id === id);
  },

  // Adicionar um novo cliente
  addCliente: (cliente: Omit<Cliente, 'id'>): Cliente => {
    const novoCliente = {
      ...cliente,
      id: Date.now().toString() // Gera ID simples baseado no timestamp
    };
    
    clientes = [...clientes, novoCliente];
    return novoCliente;
  },

  // Atualizar um cliente existente
  updateCliente: (id: string, dadosAtualizados: Partial<Cliente>): Cliente | undefined => {
    const index = clientes.findIndex(cliente => cliente.id === id);
    if (index === -1) return undefined;

    const clienteAtualizado = { ...clientes[index], ...dadosAtualizados };
    clientes[index] = clienteAtualizado;
    return clienteAtualizado;
  },

  // Remover um cliente
  removeCliente: (id: string): boolean => {
    const clientesAnteriores = [...clientes];
    clientes = clientes.filter(cliente => cliente.id !== id);
    return clientes.length < clientesAnteriores.length;
  }
};
