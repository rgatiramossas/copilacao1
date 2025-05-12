
import { OrdemServico, StatusOS } from '@/types';

// Mock de ordens de serviço para teste
let ordensServico: OrdemServico[] = [
  {
    id: '1',
    clienteId: '1',
    dataAbertura: new Date().toISOString(),
    veiculo: 'Volkswagen Golf',
    placa: 'ABC-1234',
    chassi: '9BWHE21JX24060960',
    tipoServico: 'Granizo',
    fotos: ['/placeholder.svg', '/placeholder.svg'],
    observacoes: 'Danos no capô e teto',
    precoTecnico: 250,
    precoAdministrativo: 350,
    status: 'em_andamento',
    tecnicoId: '1',
  },
  {
    id: '2',
    clienteId: '2',
    dataAbertura: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    veiculo: 'Fiat 500',
    placa: 'XYZ-5678',
    tipoServico: 'Amassado de Rua',
    fotos: ['/placeholder.svg'],
    observacoes: 'Amassado na porta do motorista',
    precoTecnico: 150,
    status: 'em_andamento',
    tecnicoId: '1',
  },
  {
    id: '3',
    clienteId: '3',
    dataAbertura: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    veiculo: 'Mercedes Classe A',
    chassi: 'WDD1770431J123456',
    tipoServico: 'Outros',
    fotos: ['/placeholder.svg', '/placeholder.svg', '/placeholder.svg'],
    observacoes: 'Reparo na lateral',
    precoTecnico: 350,
    precoAdministrativo: 500,
    status: 'concluido',
    tecnicoId: '2',
    dataEncerramento: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

export const ordemServicoService = {
  // Obter todas as ordens de serviço
  getOrdensServico: (): OrdemServico[] => {
    return [...ordensServico];
  },

  // Obter uma OS pelo ID
  getOrdemServicoById: (id: string): OrdemServico | undefined => {
    return ordensServico.find(os => os.id === id);
  },

  // Obter ordens de serviço de um cliente
  getOrdensByClienteId: (clienteId: string): OrdemServico[] => {
    return ordensServico.filter(os => os.clienteId === clienteId);
  },

  // Adicionar uma nova OS
  addOrdemServico: (os: Omit<OrdemServico, 'id'>): OrdemServico => {
    const novaOS = {
      ...os,
      id: Date.now().toString(), // Gera ID simples baseado no timestamp
      status: 'em_andamento' as StatusOS // Status padrão para nova OS é sempre "em_andamento"
    };
    
    ordensServico = [...ordensServico, novaOS];
    return novaOS;
  },

  // Atualizar uma OS existente
  updateOrdemServico: (id: string, dadosAtualizados: Partial<OrdemServico>): OrdemServico | undefined => {
    const index = ordensServico.findIndex(os => os.id === id);
    if (index === -1) return undefined;

    const osAtualizada = { ...ordensServico[index], ...dadosAtualizados };
    ordensServico[index] = osAtualizada;
    return osAtualizada;
  },

  // Verificar se um usuário pode editar uma OS baseado em seu papel e no status da OS
  podeEditarOS: (userRole: string, statusOS: StatusOS): boolean => {
    if (userRole === 'administrador' || userRole === 'gestor') {
      return true; // Administradores e gestores podem editar qualquer OS
    } else if (userRole === 'tecnico') {
      // Técnicos só podem editar OS em andamento ou concluídas
      return ['em_andamento', 'concluido'].includes(statusOS);
    }
    return false;
  },

  // Verificar se um usuário pode mudar o status de uma OS
  podeMudarStatusOS: (userRole: string, statusAtual: StatusOS, novoStatus: StatusOS): boolean => {
    if (userRole === 'administrador' || userRole === 'gestor') {
      return true; // Administradores e gestores podem mudar qualquer status
    } else if (userRole === 'tecnico') {
      // Técnicos só podem mudar de "em_andamento" para "concluido"
      return statusAtual === 'em_andamento' && novoStatus === 'concluido';
    }
    return false;
  },

  // Remover uma OS
  removeOrdemServico: (id: string): boolean => {
    const osAnteriores = [...ordensServico];
    ordensServico = ordensServico.filter(os => os.id !== id);
    return ordensServico.length < osAnteriores.length;
  }
};
