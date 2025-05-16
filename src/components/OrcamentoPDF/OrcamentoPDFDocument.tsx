
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { OrcamentoPDFHeader } from './OrcamentoPDFHeader';
import { Cliente, OrcamentoDetalhado } from '@/types';

interface OrcamentoPDFDocumentProps {
  orcamento: OrcamentoDetalhado;
  cliente: Cliente | undefined;
}

const formatarData = (dataString?: string) => {
  if (!dataString) return '-';
  try {
    return format(new Date(dataString), 'dd/MM/yyyy', { locale: ptBR });
  } catch {
    return 'Data inválida';
  }
};

const formatarPreco = (preco?: number) => preco ? `€${preco.toFixed(2)}` : '-';

export function OrcamentoPDFDocument({ orcamento, cliente }: OrcamentoPDFDocumentProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 print:p-4 print:shadow-none">
      <OrcamentoPDFHeader
        numeroDoPedido={orcamento.id}
        data={formatarData(orcamento.data)}
        clienteNome={cliente?.nome || 'Cliente não encontrado'}
        veiculo={orcamento.veiculo}
        placa={orcamento.placa}
        chassi={orcamento.chassi}
      />
      
      {/* Seção de Danos e Serviços */}
      <div className="mt-6">
        <h2 className="text-lg font-bold text-blue-600 mb-3">Detalhes dos Danos</h2>
        
        <table className="w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-left">Peça</th>
              <th className="border border-gray-300 p-2 text-center">Amassados 20mm</th>
              <th className="border border-gray-300 p-2 text-center">Amassados 30mm</th>
              <th className="border border-gray-300 p-2 text-center">Amassados 40mm</th>
              <th className="border border-gray-300 p-2 text-center">Materiais</th>
            </tr>
          </thead>
          <tbody>
            {orcamento.danos.map((dano, index) => {
              // Encontrar o nome da peça baseado no ID
              const pecaNome = (() => {
                switch (dano.pecaId) {
                  case 'capo': return 'Capô';
                  case 'paraLamaEsquerdo': return 'Para-lama Esquerdo';
                  case 'paraLamaDireito': return 'Para-lama Direito';
                  case 'portaDianteiraEsquerda': return 'Porta Dianteira Esquerda';
                  case 'portaDianteiraDireita': return 'Porta Dianteira Direita';
                  case 'portaTraseiraEsquerda': return 'Porta Traseira Esquerda';
                  case 'portaTraseiraDireita': return 'Porta Traseira Direita';
                  case 'colunaEsquerda': return 'Coluna Esquerda';
                  case 'colunaDireita': return 'Coluna Direita';
                  case 'teto': return 'Teto';
                  case 'portaMalasSuperior': return 'Porta Malas Superior';
                  case 'portaMalasInferior': return 'Porta Malas Inferior';
                  case 'lateralEsquerda': return 'Lateral Esquerda';
                  case 'lateralDireita': return 'Lateral Direita';
                  default: return dano.pecaId;
                }
              })();

              // Verificar materiais especiais
              const materiais = [];
              if (dano.materiais.aluminio) materiais.push('Alumínio (A)');
              if (dano.materiais.cola) materiais.push('Cola (K)');
              if (dano.materiais.pintura) materiais.push('Pintura (P)');

              const hasAmassados = dano.amassados.mm20 > 0 || dano.amassados.mm30 > 0 || dano.amassados.mm40 > 0;

              return hasAmassados ? (
                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-300 p-2">{pecaNome}</td>
                  <td className="border border-gray-300 p-2 text-center">{dano.amassados.mm20 || '-'}</td>
                  <td className="border border-gray-300 p-2 text-center">{dano.amassados.mm30 || '-'}</td>
                  <td className="border border-gray-300 p-2 text-center">{dano.amassados.mm40 || '-'}</td>
                  <td className="border border-gray-300 p-2 text-center">{materiais.length > 0 ? materiais.join(', ') : '-'}</td>
                </tr>
              ) : null;
            }).filter(Boolean)}
          </tbody>
        </table>

        {/* Itens adicionais */}
        {orcamento.itens && orcamento.itens.length > 0 && (
          <>
            <h2 className="text-lg font-bold text-blue-600 mb-3">Itens Adicionais</h2>
            <table className="w-full border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-2 text-left">Descrição</th>
                  <th className="border border-gray-300 p-2 text-center">Quantidade</th>
                  <th className="border border-gray-300 p-2 text-right">Valor Unitário (€)</th>
                  <th className="border border-gray-300 p-2 text-right">Total (€)</th>
                </tr>
              </thead>
              <tbody>
                {orcamento.itens.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 p-2">{item.descricao}</td>
                    <td className="border border-gray-300 p-2 text-center">{item.quantidade}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatarPreco(item.valor)}</td>
                    <td className="border border-gray-300 p-2 text-right">{formatarPreco(item.valor * item.quantidade)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {/* Observações */}
        {orcamento.observacoes && (
          <>
            <h2 className="text-lg font-bold text-blue-600 mb-3">Observações</h2>
            <div className="border border-gray-300 p-3 mb-6 whitespace-pre-line bg-gray-50">
              {orcamento.observacoes}
            </div>
          </>
        )}

        {/* Totais */}
        <div className="mt-8 border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Total AW:</span>
            <span className="font-medium">{orcamento.totalAW}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">Valor Total:</span>
            <span className="font-bold text-xl text-blue-600">{formatarPreco(orcamento.precoEuro)}</span>
          </div>
        </div>

        {/* Assinaturas */}
        <div className="mt-16 pt-8 grid grid-cols-2 gap-16">
          <div className="border-t border-gray-400 pt-2 text-center">
            <p>Assinatura do técnico</p>
          </div>
          <div className="border-t border-gray-400 pt-2 text-center">
            <p>Assinatura do cliente</p>
          </div>
        </div>
      </div>
    </div>
  );
}
