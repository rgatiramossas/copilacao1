
import { OrcamentoDetalhado, PecaVeiculo } from '@/types';

// Define as peças do veículo para o grid
export const pecasVeiculo: PecaVeiculo[] = [
  { id: 'paraLamaEsquerdo', nome: 'Para-lama Esquerdo', posicao: { linha: 0, coluna: 0 } },
  { id: 'capo', nome: 'Capô', posicao: { linha: 0, coluna: 1 } },
  { id: 'paraLamaDireito', nome: 'Para-lama Direito', posicao: { linha: 0, coluna: 2 } },
  
  { id: 'colunaEsquerda', nome: 'Coluna Esquerda', posicao: { linha: 1, coluna: 0 } },
  { id: 'teto', nome: 'Teto', posicao: { linha: 1, coluna: 1 } },
  { id: 'colunaDireita', nome: 'Coluna Direita', posicao: { linha: 1, coluna: 2 } },
  
  { id: 'portaDianteiraEsquerda', nome: 'Porta Dianteira Esquerda', posicao: { linha: 2, coluna: 0 } },
  // Espaço vazio para foto no centro
  { id: 'portaDianteiraDireita', nome: 'Porta Dianteira Direita', posicao: { linha: 2, coluna: 2 } },
  
  { id: 'portaTraseiraEsquerda', nome: 'Porta Traseira Esquerda', posicao: { linha: 3, coluna: 0 } },
  { id: 'portaMalasSuperior', nome: 'Porta Malas Superior', posicao: { linha: 3, coluna: 1 } },
  { id: 'portaTraseiraDireita', nome: 'Porta Traseira Direita', posicao: { linha: 3, coluna: 2 } },
  
  { id: 'lateralEsquerda', nome: 'Lateral Esquerda', posicao: { linha: 4, coluna: 0 } },
  { id: 'portaMalasInferior', nome: 'Porta Malas Inferior', posicao: { linha: 4, coluna: 1 } },
  { id: 'lateralDireita', nome: 'Lateral Direita', posicao: { linha: 4, coluna: 2 } },
];

// Mock de orçamentos detalhados para teste
let orcamentosDetalhados: OrcamentoDetalhado[] = [
  {
    id: '1',
    data: new Date().toISOString(),
    clienteId: '1',
    veiculo: 'Volkswagen Golf',
    placa: 'ABC-1234',
    chassi: '9BWHE21JX24060960',
    danos: [
      {
        pecaId: 'capo',
        amassados: {
          mm20: 2,
          mm30: 1,
          mm40: 0
        },
        materiais: {
          aluminio: true,
          cola: false,
          pintura: true
        }
      },
      {
        pecaId: 'paraLamaEsquerdo',
        amassados: {
          mm20: 1,
          mm30: 0,
          mm40: 0
        },
        materiais: {
          aluminio: false,
          cola: true,
          pintura: false
        }
      }
    ],
    totalAW: 3,
    precoEuro: 150
  },
  {
    id: '2',
    data: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    clienteId: '2',
    veiculo: 'Fiat 500',
    placa: 'XYZ-5678',
    danos: [
      {
        pecaId: 'portaDianteiraDireita',
        amassados: {
          mm20: 0,
          mm30: 2,
          mm40: 1
        },
        materiais: {
          aluminio: false,
          cola: false,
          pintura: true
        }
      }
    ],
    totalAW: 3,
    precoEuro: 180
  }
];

export const orcamentoService = {
  // Obter todos os orçamentos
  getOrcamentos: (): OrcamentoDetalhado[] => {
    return [...orcamentosDetalhados];
  },

  // Obter um orçamento pelo ID
  getOrcamentoById: (id: string): OrcamentoDetalhado | undefined => {
    return orcamentosDetalhados.find(orc => orc.id === id);
  },

  // Adicionar um novo orçamento
  addOrcamento: (orcamento: Omit<OrcamentoDetalhado, 'id'>): OrcamentoDetalhado => {
    const novoOrcamento = {
      ...orcamento,
      id: Date.now().toString() // Gera ID simples baseado no timestamp
    };
    
    orcamentosDetalhados = [...orcamentosDetalhados, novoOrcamento];
    return novoOrcamento;
  },

  // Atualizar um orçamento existente
  updateOrcamento: (id: string, dadosAtualizados: Partial<OrcamentoDetalhado>): OrcamentoDetalhado | undefined => {
    const index = orcamentosDetalhados.findIndex(orc => orc.id === id);
    if (index === -1) return undefined;

    const orcamentoAtualizado = { ...orcamentosDetalhados[index], ...dadosAtualizados };
    orcamentosDetalhados[index] = orcamentoAtualizado;
    return orcamentoAtualizado;
  },

  // Remover um orçamento
  removeOrcamento: (id: string): boolean => {
    const orcamentosAnteriores = [...orcamentosDetalhados];
    orcamentosDetalhados = orcamentosDetalhados.filter(orc => orc.id !== id);
    return orcamentosDetalhados.length < orcamentosAnteriores.length;
  },

  // Calcular o valor total do orçamento
  calcularValorTotal: (danos: DanoVeiculo[]): { totalAW: number; precoEuro: number } => {
    // Preço base por tamanho de amassado (exemplo)
    const precoBase = {
      mm20: 15, // 15 euros por amassado de 20mm
      mm30: 25, // 25 euros por amassado de 30mm
      mm40: 40, // 40 euros por amassado de 40mm
    };
    
    let totalAW = 0;
    let precoBase = 0;
    
    danos.forEach(dano => {
      // Soma quantidade de amassados (cada amassado é 1 AW)
      totalAW += dano.amassados.mm20 + dano.amassados.mm30 + dano.amassados.mm40;
      
      // Calcula preço base
      precoBase += dano.amassados.mm20 * 15;
      precoBase += dano.amassados.mm30 * 25;
      precoBase += dano.amassados.mm40 * 40;
      
      // Aplica adicionais por material especial
      if (dano.materiais.aluminio) {
        precoBase *= 1.25; // +25% para alumínio
      }
      
      if (dano.materiais.cola) {
        precoBase *= 1.3; // +30% para cola
      }
      
      // Não aplicamos alteração de preço para pintura neste exemplo simples
    });
    
    return {
      totalAW,
      precoEuro: precoBase
    };
  }
};

