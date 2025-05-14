import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { DanoVeiculo } from '@/types';

interface DanoPecaEditorProps {
  dano: DanoVeiculo;
  onChange: (tamanho: keyof DanoVeiculo['amassados'], valor: number) => void;
  onMaterialChange: (material: keyof DanoVeiculo['materiais'], checked: boolean) => void;
  disabled?: boolean;
}

export function DanoPecaEditor({ dano, onChange, onMaterialChange, disabled = false }: DanoPecaEditorProps) {
  // Funções para lidar com o foco e desfoco dos inputs
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value === "0") {
      e.target.value = "";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, tamanho: keyof DanoVeiculo['amassados']) => {
    if (e.target.value === "") {
      e.target.value = "0";
      onChange(tamanho, 0);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col justify-between">
      {/* Amassados */}
      <div className="grid gap-1 w-full">
        <div className="grid grid-cols-[35px,1fr] sm:grid-cols-[60px,1fr] items-center">
          <label className="text-xs sm:text-sm">20mm</label>
          <div className="flex justify-end pr-1 sm:pr-2">
            <Input
              type="number"
              value={dano.amassados.mm20}
              onChange={(e) => onChange('mm20', parseInt(e.target.value) || 0)}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, 'mm20')}
              className="w-14 sm:w-16 text-center p-1 h-8"
              min={0}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-[45px,1fr] sm:grid-cols-[60px,1fr] items-center">
          <label className="text-sm">30mm</label>
          <div className="flex justify-end">
            <Input
              type="number"
              value={dano.amassados.mm30}
              onChange={(e) => onChange('mm30', parseInt(e.target.value) || 0)}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, 'mm30')}
              className="w-12 sm:w-16 text-center p-1 h-8"
              min={0}
              disabled={disabled}
            />
          </div>
        </div>
        <div className="grid grid-cols-[45px,1fr] sm:grid-cols-[60px,1fr] items-center">
          <label className="text-sm">40mm</label>
          <div className="flex justify-end">
            <Input
              type="number"
              value={dano.amassados.mm40}
              onChange={(e) => onChange('mm40', parseInt(e.target.value) || 0)}
              onFocus={handleFocus}
              onBlur={(e) => handleBlur(e, 'mm40')}
              className="w-12 sm:w-16 text-center p-1 h-8"
              min={0}
              disabled={disabled}
            />
          </div>
        </div>
      </div>

      {/* Materiais */}
      <div className="flex space-x-3 pt-2 border-t">
        <div className="flex items-center space-x-1">
          <Checkbox
            id={`aluminio-${dano.pecaId}`}
            checked={dano.materiais.aluminio}
            onCheckedChange={(checked) => onMaterialChange('aluminio', checked === true)}
            disabled={disabled}
          />
          <label 
            htmlFor={`aluminio-${dano.pecaId}`} 
            className="text-xs font-medium cursor-pointer select-none"
          >
            A
          </label>
        </div>

        <div className="flex items-center space-x-1">
          <Checkbox
            id={`cola-${dano.pecaId}`}
            checked={dano.materiais.cola}
            onCheckedChange={(checked) => onMaterialChange('cola', checked === true)}
            disabled={disabled}
          />
          <label 
            htmlFor={`cola-${dano.pecaId}`} 
            className="text-xs font-medium cursor-pointer select-none"
          >
            K
          </label>
        </div>

        <div className="flex items-center space-x-1">
          <Checkbox
            id={`pintura-${dano.pecaId}`}
            checked={dano.materiais.pintura}
            onCheckedChange={(checked) => onMaterialChange('pintura', checked === true)}
            disabled={disabled}
          />
          <label 
            htmlFor={`pintura-${dano.pecaId}`} 
            className="text-xs font-medium cursor-pointer select-none"
          >
            P
          </label>
        </div>
      </div>
    </div>
  );
}