
export type UserRole = 'administrador' | 'tecnico' | 'gestor';

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
}

export interface Cliente {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  endereco: string;
  cidade: string;
  estado: string;
  cep: string;
  observacoes?: string;
  gestorId?: string;
}

export interface OrdemServico {
  id: string;
  clienteId: string;
  tecnicoId: string;
  dataAbertura: string;
  dataEncerramento?: string;
  descricao: string;
  status: 'aberta' | 'em_andamento' | 'concluida' | 'cancelada';
  valorOrcamento?: number;
  valorFinal?: number;
  fotos?: string[];
}

export interface Orcamento {
  id: string;
  ordemServicoId: string;
  valor: number;
  descricao: string;
  aprovado: boolean;
  dataAprovacao?: string;
}
