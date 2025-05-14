import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DanoVeiculo } from '@/types';
import { DanoPecaEditor } from './DanoPecaEditor';
import { pecasVeiculo } from '@/services/orcamentoService';

interface DanosVeiculoGridProps {
  danos: DanoVeiculo[];
  isEditing: boolean;
  handleAmassadosChange: (pecaId: string, tamanho: keyof DanoVeiculo['amassados'], valor: number) => void;
  handleMateriaisChange: (pecaId: string, material: keyof DanoVeiculo['materiais'], checked: boolean) => void;
}

export function DanosVeiculoGrid({ 
  danos, 
  isEditing, 
  handleAmassadosChange, 
  handleMateriaisChange 
}: DanosVeiculoGridProps) {

  // Encontra o dano de uma peça específica
  const findDano = (pecaId: string) => {
    return danos.find(dano => dano.pecaId === pecaId) || {
      pecaId,
      amassados: { mm20: 0, mm30: 0, mm40: 0 },
      materiais: { aluminio: false, cola: false, pintura: false }
    };
  };

  // Obtém o nome da peça
  const getNomePeca = (pecaId: string) => {
    const peca = pecasVeiculo.find(p => p.id === pecaId);
    return peca ? peca.nome : 'Desconhecido';
  };

  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4">
      {/* Linha 1 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('paraLamaEsquerdo')}</h3>
          <DanoPecaEditor 
            dano={findDano('paraLamaEsquerdo')} 
            onChange={(tamanho, valor) => handleAmassadosChange('paraLamaEsquerdo', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('paraLamaEsquerdo', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('capo')}</h3>
          <DanoPecaEditor 
            dano={findDano('capo')} 
            onChange={(tamanho, valor) => handleAmassadosChange('capo', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('capo', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('paraLamaDireito')}</h3>
          <DanoPecaEditor 
            dano={findDano('paraLamaDireito')} 
            onChange={(tamanho, valor) => handleAmassadosChange('paraLamaDireito', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('paraLamaDireito', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      {/* Linha 2 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('colunaEsquerda')}</h3>
          <DanoPecaEditor 
            dano={findDano('colunaEsquerda')} 
            onChange={(tamanho, valor) => handleAmassadosChange('colunaEsquerda', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('colunaEsquerda', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('teto')}</h3>
          <DanoPecaEditor 
            dano={findDano('teto')} 
            onChange={(tamanho, valor) => handleAmassadosChange('teto', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('teto', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('colunaDireita')}</h3>
          <DanoPecaEditor 
            dano={findDano('colunaDireita')} 
            onChange={(tamanho, valor) => handleAmassadosChange('colunaDireita', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('colunaDireita', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      {/* Linha 3 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('portaDianteiraEsquerda')}</h3>
          <DanoPecaEditor 
            dano={findDano('portaDianteiraEsquerda')} 
            onChange={(tamanho, valor) => handleAmassadosChange('portaDianteiraEsquerda', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('portaDianteiraEsquerda', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      {/* Espaço para foto */}
      <Card className="flex items-center justify-center">
        <CardContent className="p-4 flex flex-col items-center justify-center">
          <Image className="h-12 w-12 text-gray-400" />
          <p className="text-sm text-gray-500 mt-2">Foto do veículo</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-2"
            disabled={!isEditing}
          >
            Upload
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('portaDianteiraDireita')}</h3>
          <DanoPecaEditor 
            dano={findDano('portaDianteiraDireita')} 
            onChange={(tamanho, valor) => handleAmassadosChange('portaDianteiraDireita', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('portaDianteiraDireita', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      {/* Linha 4 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('portaTraseiraEsquerda')}</h3>
          <DanoPecaEditor 
            dano={findDano('portaTraseiraEsquerda')} 
            onChange={(tamanho, valor) => handleAmassadosChange('portaTraseiraEsquerda', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('portaTraseiraEsquerda', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('portaMalasSuperior')}</h3>
          <DanoPecaEditor 
            dano={findDano('portaMalasSuperior')} 
            onChange={(tamanho, valor) => handleAmassadosChange('portaMalasSuperior', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('portaMalasSuperior', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('portaTraseiraDireita')}</h3>
          <DanoPecaEditor 
            dano={findDano('portaTraseiraDireita')} 
            onChange={(tamanho, valor) => handleAmassadosChange('portaTraseiraDireita', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('portaTraseiraDireita', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      {/* Linha 5 */}
      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('lateralEsquerda')}</h3>
          <DanoPecaEditor 
            dano={findDano('lateralEsquerda')} 
            onChange={(tamanho, valor) => handleAmassadosChange('lateralEsquerda', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('lateralEsquerda', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('portaMalasInferior')}</h3>
          <DanoPecaEditor 
            dano={findDano('portaMalasInferior')} 
            onChange={(tamanho, valor) => handleAmassadosChange('portaMalasInferior', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('portaMalasInferior', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="font-medium mb-2">{getNomePeca('lateralDireita')}</h3>
          <DanoPecaEditor 
            dano={findDano('lateralDireita')} 
            onChange={(tamanho, valor) => handleAmassadosChange('lateralDireita', tamanho, valor)}
            onMaterialChange={(material, checked) => handleMateriaisChange('lateralDireita', material, checked)}
            disabled={!isEditing}
          />
        </CardContent>
      </Card>
    </div>
  );
}