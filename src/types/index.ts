
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
