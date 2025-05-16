
import React from 'react';

interface OrcamentoPDFHeaderProps {
  numeroDoPedido?: string;
  data: string;
  clienteNome: string;
  veiculo: string;
  placa?: string;
  chassi?: string;
}

export function OrcamentoPDFHeader({
  numeroDoPedido = 'BUDGET',
  data,
  clienteNome,
  veiculo,
  placa,
  chassi,
}: OrcamentoPDFHeaderProps) {
  return (
    <div className="font-sans">
      {/* Cabeçalho com logotipo e nome */}
      <div className="mb-4">
        <div className="flex items-center">
          <span className="text-3xl font-bold">
            <span className="text-blue-600">EURO</span> 
            <span className="text-black">DENT</span>
            <span className="text-sm ml-1 text-gray-700">EXPERTS</span>
          </span>
        </div>
        <div className="w-full h-0.5 bg-blue-600 mt-1"></div>
      </div>
      
      {/* Barra de título principal */}
      <div className="bg-blue-600 text-white p-2 rounded flex justify-between items-center mb-4">
        <span className="font-bold">Orçamento #{numeroDoPedido}</span>
        <span>{data}</span>
      </div>
      
      {/* Grid de duas colunas com informações do cliente e veículo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Informações do cliente */}
        <div className="border rounded p-4">
          <div className="text-blue-600 font-bold mb-2">Dados do Cliente</div>
          <div>
            <span className="font-semibold">Cliente:</span> {clienteNome}
          </div>
          <div>
            <span className="font-semibold">Data:</span> {data}
          </div>
        </div>
        
        {/* Informações do veículo */}
        <div className="border rounded p-4">
          <div className="text-blue-600 font-bold mb-2">Dados do Veículo</div>
          <div>
            <span className="font-semibold">Veículo:</span> {veiculo}
          </div>
          {placa && (
            <div>
              <span className="font-semibold">Placa:</span> {placa}
            </div>
          )}
          <div>
            <span className="font-semibold">Número do Chassi:</span> {chassi || '---'}
          </div>
        </div>
      </div>
      
      {/* Linha divisória final */}
      <div className="w-full h-0.5 bg-blue-600 mb-4"></div>
    </div>
  );
}
