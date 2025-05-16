
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

export type StatusOS = 
  | 'em_andamento' 
  | 'concluido' 
  | 'em_aprovacao' 
  | 'aprovado' 
  | 'faturado' 
  | 'pago' 
  | 'cancelado';

export interface OrdemServico {
  id: string;
  clienteId: string;
  dataAbertura: string;
  veiculo: string;
  placa?: string;
  chassi?: string;
  tipoServico: 'Granizo' | 'Amassado de Rua' | 'Outros';
  fotos: string[];
  observacoes?: string;
  precoTecnico?: number;
  precoAdministrativo?: number;
  status: StatusOS;
  tecnicoId?: string;
  dataEncerramento?: string;
}

export interface Orcamento {
  id: string;
  ordemServicoId: string;
  valor: number;
  descricao: string;
  aprovado: boolean;
  dataAprovacao?: string;
}

// Interfaces para o sistema de orçamentos detalhados
export interface DanoVeiculo {
  pecaId: string;
  amassados: {
    mm20: number;
    mm30: number;
    mm40: number;
  };
  materiais: {
    aluminio: boolean; // A
    cola: boolean;     // K
    pintura: boolean;  // P
  };
}

export interface OrcamentoDetalhado {
  id: string;
  data: string;
  clienteId: string;
  veiculo: string;
  placa?: string;
  chassi?: string;
  danos: DanoVeiculo[];
  foto?: string;
  totalAW: number;
  precoEuro: number;
  observacoes?: string;
  itens?: Array<{
    descricao: string;
    quantidade: number;
    valor: number;
  }>;
}

export interface PecaVeiculo {
  id: string;
  nome: string;
  posicao: {
    linha: number;
    coluna: number;
  };
}
