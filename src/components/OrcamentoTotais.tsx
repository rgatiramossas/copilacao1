
import React from 'react';

interface OrcamentoTotaisProps {
  totalAW: number;
  precoEuro: number;
}

export function OrcamentoTotais({ totalAW, precoEuro }: OrcamentoTotaisProps) {
  return (
    <div className="mt-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Total de AW</h3>
          <p className="text-2xl font-bold">{totalAW}</p>
        </div>
        <div>
          <h3 className="text-lg font-medium">Preço (€)</h3>
          <p className="text-2xl font-bold">{precoEuro.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Legenda */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-2">Materiais Especiais</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <span className="font-bold">(A)</span> = Alumínio (+25%)
          </div>
          <div>
            <span className="font-bold">(K)</span> = Cola (+30%)
          </div>
          <div>
            <span className="font-bold">(P)</span> = Pintura
          </div>
        </div>
      </div>
    </div>
  );
}
