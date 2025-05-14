import { OrcamentoDetalhado, PecaVeiculo, DanoVeiculo } from '@/types';

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

// Lista de peças horizontais (as demais são verticais)
export const horizontalParts = ['capo', 'teto', 'portaMalasSuperior'];

// Função para cálculo de orçamento de granizo
export const hailCalculation = (
    size: number,
    dents: number,
    isVertical: boolean = false,
    isAluminum: boolean = false,
    isGlueTechnique: boolean = false,
    needsVordrucken: boolean = false,
    needsHohlraum: boolean = false,
    hourlyRate: number = 28 // Taxa horária padrão de 28€
): { aw: number; hours: number; cost: number } => {
    const baseData: Record<'horizontal' | 'vertical', Record<number, Record<number, number>>> = {
        horizontal: {
            20: { 1: 6, 2: 7, 3: 8, 4: 9, 5: 10, 6: 11, 7: 12, 8: 13, 9: 14, 10: 15,
                13: 17, 16: 19, 19: 20, 22: 22, 25: 23, 28: 24, 31: 25, 34: 26, 37: 27, 40: 28,
                45: 30, 50: 32, 55: 33, 60: 35, 65: 37, 70: 39, 75: 40, 80: 42, 85: 44, 90: 46,
                95: 47, 100: 49, 110: 53, 120: 56, 130: 60, 140: 63, 150: 67, 160: 70, 170: 74, 180: 77,
                190: 80, 200: 84, 210: 87, 220: 91, 230: 94, 240: 98, 250: 102, 260: 104, 270: 106, 280: 109,
                 300: 114, 325: 122, 350: 129, 375: 137, 400: 145, 425: 153, 450: 160, 475: 168, 500: 176, 525: 183,
                 550: 191, 575: 199, 600: 206 },
          
            30: { 1: 7, 2: 9, 3: 10, 4: 12, 5: 13, 6: 15, 7: 16, 8: 18, 9: 19, 10: 21,
                13: 23, 16: 25, 19: 27, 22: 29, 25: 30, 28: 32, 31: 33, 34: 35, 37: 36, 40: 38,
                45: 40, 50: 43, 55: 45, 60: 48, 65: 50, 70: 53, 75: 55, 80: 58, 85: 60, 90: 63,
                95: 65, 100: 68, 110: 73, 120: 78, 130: 83, 140: 88, 150: 93, 160: 98, 170: 103, 180: 108,
                190: 113, 200: 118, 210: 123, 220: 128, 230: 133, 240: 138, 250: 143, 260: 147, 270: 151, 280: 155,
                 300: 163, 325: 174, 350: 186, 375: 197, 400: 209, 425: 220, 450: 232, 475: 243, 500: 255, 525: 266,
                 550: 278, 575: 289, 600: 301 },

            40: { 1: 8, 2: 10, 3: 12, 4: 14, 5: 16, 6: 18, 7: 20, 8: 22, 9: 24, 10: 26,
                13: 29, 16: 32, 19: 35, 22: 37, 25: 40, 28: 42, 31: 44, 34: 46, 37: 48, 40: 50,
                45: 54, 50: 57, 55: 61, 60: 64, 65: 68, 70: 71, 75: 75, 80: 78, 85: 82, 90: 85,
                95: 89, 100: 92, 110: 99, 120: 106, 130: 113, 140: 120, 150: 127, 160: 134, 170: 141, 180: 148,
                190: 155, 200: 162, 210: 169, 220: 176, 230: 183, 240: 190, 250: 197, 260: 203, 270: 209, 280: 215,
                 300: 229, 325: 246, 350: 264, 375: 281, 400: 298, 425: 315, 450: 332, 475: 349, 500: 366, 525: 384,
                 550: 401, 575: 418, 600: 435 }
        },
        vertical: {
            20: { 1: 6, 2: 8, 3: 9, 4: 11, 5: 12, 6: 13, 7: 14, 8: 15, 9: 16, 10: 17,
                11: 18, 12: 16, 13: 20, 14: 21, 15: 22, 16: 23, 17: 24, 18: 25, 19: 26, 20: 27,
                21: 28, 22: 29, 23: 29, 24: 30, 25: 31, 26: 32, 27: 32, 28: 33, 29: 34, 30: 35, 31: 35,
                 32: 36, 33: 37, 34: 38, 35: 38, 36: 39, 37: 40, 38: 41, 39: 41,
                40: 42, 41: 43, 42: 44, 43: 44, 44: 45, 45: 46, 46: 47, 47: 47, 48: 48, 49: 49,
                50: 50, 51: 51, 52: 51, 53: 52, 54: 53, 55: 54, 60: 60, 65: 65, 70: 70, 80: 82, 90: 94, 100: 106 },
            
            30: { 1: 7, 2: 9, 3: 11, 4: 13, 5: 15, 6: 17, 7: 18, 8: 20, 9: 21, 10: 23,
                11: 24, 12: 26, 13: 27, 14: 29, 15: 30, 16: 32, 17: 33, 18: 35, 19: 36, 20: 38,
                21: 39, 22: 40, 23: 41, 24: 42, 25: 43, 26: 44, 27: 45, 28: 46, 29: 47, 30: 48, 31: 49,
                 32: 50, 33: 51, 34: 52, 35: 53, 36: 54, 37: 55, 38: 56, 39: 57,
                40: 58, 41: 59, 42: 60, 43: 61, 44: 62, 45: 63, 46: 64, 47: 65, 48: 66, 49: 67,
                50: 68, 51: 69, 52: 70, 53: 71, 54: 72, 55: 73, 60: 78, 65: 83, 70: 88, 80: 99, 90: 119, 100: 129 },
          
            40: { 1: 9, 2: 12, 3: 14, 4: 17, 5: 19, 6: 21, 7: 23, 8: 25, 9: 27, 10: 29,
                11: 31, 12: 33, 13: 35, 14: 37, 15: 39, 16: 41, 17: 43, 18: 45, 19: 47, 20: 49,
                21: 51, 22: 52, 23: 54, 24: 55, 25: 57, 26: 58, 27: 60, 28: 61, 29: 63, 30: 64, 31: 66,
                 32: 67, 33: 69, 34: 70, 35: 72, 36: 73, 37: 75, 38: 76, 39: 78,
                40: 79, 41: 81, 42: 82, 43: 84, 44: 85, 45: 87, 46: 88, 47: 90, 48: 91, 49: 93,
                50: 94, 51: 96, 52: 97, 53: 99, 54: 100, 55: 102, 60: 108, 65: 115, 70: 122, 80: 136, 90: 150, 100: 164 }
        }
    };

    // Validações para evitar referências a valores inexistentes
    if (!size || !dents || !awTable[size]) {
        console.error(`Tamanho inválido: ${size}mm`);
        return { aw: 0, hours: 0, cost: 0 };
    }
    
    // Verificar a orientação da peça e selecionar a tabela adequada
    const awTable = isVertical ? baseData.vertical : baseData.horizontal;
    
    // Arredondar para o número disponível na tabela
    const closestDents = Object.keys(awTable[size])
        .map(Number)
        .sort((a, b) => a - b)
        .find(num => num >= dents) || Math.max(...Object.keys(awTable[size]).map(Number));
    
    if (!closestDents) {
        console.error(`Número de amassados não encontrado para tamanho ${size}mm`);
        return { aw: 0, hours: 0, cost: 0 };
    }

    let aw = awTable[size][closestDents];
    
    // Aplicar multiplicadores
    if (isAluminum) aw *= 1.25;
    if (isGlueTechnique) aw *= 1.30;
    if (needsVordrucken) aw *= 1.60;
    if (needsHohlraum) aw += 4;

    // Arredondar para inteiro
    aw = Math.round(aw);
    const hours = aw / 10;
    const cost = hours * hourlyRate;

    return { 
        aw, 
        hours: parseFloat(hours.toFixed(1)), 
        cost: parseFloat(cost.toFixed(2)) 
    };
};

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
    let totalAW = 0;
    let totalCost = 0;

    // Para cada dano calculamos o valor
    danos.forEach(dano => {
      // Verificamos se há amassados
      const totalAmassados = dano.amassados.mm20 + dano.amassados.mm30 + dano.amassados.mm40;
      if (totalAmassados === 0) return; // Pula se não há amassados
      
      // Verificamos se é uma peça horizontal
      const isVertical = !horizontalParts.includes(dano.pecaId);
      
      // Calculamos para cada tamanho de amassado
      if (dano.amassados.mm20 > 0) {
        const result = hailCalculation(
          20,
          dano.amassados.mm20,
          isVertical,
          dano.materiais.aluminio,
          dano.materiais.cola
        );
        totalAW += result.aw;
        totalCost += result.cost;
      }
      
      if (dano.amassados.mm30 > 0) {
        const result = hailCalculation(
          30,
          dano.amassados.mm30,
          isVertical,
          dano.materiais.aluminio,
          dano.materiais.cola
        );
        totalAW += result.aw;
        totalCost += result.cost;
      }
      
      if (dano.amassados.mm40 > 0) {
        const result = hailCalculation(
          40,
          dano.amassados.mm40,
          isVertical,
          dano.materiais.aluminio,
          dano.materiais.cola
        );
        totalAW += result.aw;
        totalCost += result.cost;
      }
    });
    
    // O preço final é baseado no custo total (convertido para euros com taxa de 2.8)
    return {
      totalAW: Math.round(totalAW),
      precoEuro: parseFloat((totalAW * 2.8).toFixed(2))
    };
  }
};
