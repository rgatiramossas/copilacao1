
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Car, Image, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

import { orcamentoService, pecasVeiculo } from '@/services/orcamentoService';
import { clienteService } from '@/services/clienteService';
import { DanoVeiculo, OrcamentoDetalhado } from '@/types';

// Schema para validação do formulário
const formSchema = z.object({
  data: z.date({
    required_error: "A data é obrigatória",
  }),
  clienteId: z.string({
    required_error: "O cliente é obrigatório",
  }),
  veiculo: z.string().min(2, {
    message: "O nome do veículo deve ter pelo menos 2 caracteres",
  }),
  placa: z.string().optional(),
  chassi: z.string().optional(),
  foto: z.string().optional(),
}).refine(data => data.placa || data.chassi, {
  message: "Placa ou Chassi é obrigatório",
  path: ["placa"],
});

interface OrcamentoFormProps {
  orcamentoId?: string;
  isReadOnly?: boolean;
}

export default function OrcamentoForm({ orcamentoId, isReadOnly = false }: OrcamentoFormProps) {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<any[]>([]);
  const [danos, setDanos] = useState<DanoVeiculo[]>([]);
  const [totalAW, setTotalAW] = useState(0);
  const [precoEuro, setPrecoEuro] = useState(0);
  const [isEditing, setIsEditing] = useState(!isReadOnly && !orcamentoId);

  // Inicializa o formulário com react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: new Date(),
      veiculo: "",
      placa: "",
      chassi: "",
    },
  });

  // Carrega os clientes
  useEffect(() => {
    const loadClientes = async () => {
      const clientesData = clienteService.getClientes();
      setClientes(clientesData);
    };

    loadClientes();
  }, []);

  // Inicializar os danos vazios para todas as peças do veículo
  useEffect(() => {
    if (!orcamentoId) {
      const initialDanos = pecasVeiculo.map(peca => ({
        pecaId: peca.id,
        amassados: {
          mm20: 0,
          mm30: 0,
          mm40: 0,
        },
        materiais: {
          aluminio: false,
          cola: false,
          pintura: false,
        },
      }));
      setDanos(initialDanos);
    }
  }, [orcamentoId]);

  // Carrega os dados do orçamento se estiver editando
  useEffect(() => {
    if (orcamentoId) {
      const orcamento = orcamentoService.getOrcamentoById(orcamentoId);
      if (orcamento) {
        // Preenche o formulário com os dados do orçamento
        form.reset({
          data: new Date(orcamento.data),
          clienteId: orcamento.clienteId,
          veiculo: orcamento.veiculo,
          placa: orcamento.placa || undefined,
          chassi: orcamento.chassi || undefined,
          foto: orcamento.foto,
        });

        // Preenche os danos
        if (orcamento.danos) {
          // Primeiro inicializa com todos os danos vazios
          const allDanos = pecasVeiculo.map(peca => {
            const existingDano = orcamento.danos.find(d => d.pecaId === peca.id);
            
            if (existingDano) {
              return existingDano;
            }
            
            return {
              pecaId: peca.id,
              amassados: {
                mm20: 0,
                mm30: 0,
                mm40: 0,
              },
              materiais: {
                aluminio: false,
                cola: false,
                pintura: false,
              },
            };
          });
          
          setDanos(allDanos);
        }

        // Atualiza os totais
        setTotalAW(orcamento.totalAW);
        setPrecoEuro(orcamento.precoEuro);
      }
    }
  }, [orcamentoId, form]);

  // Atualiza totais sempre que os danos mudam
  useEffect(() => {
    const { totalAW: newTotalAW, precoEuro: newPrecoEuro } = orcamentoService.calcularValorTotal(danos);
    setTotalAW(newTotalAW);
    setPrecoEuro(newPrecoEuro);
  }, [danos]);

  // Função para atualizar os valores de amassados
  const handleAmassadosChange = (pecaId: string, tamanho: keyof DanoVeiculo['amassados'], valor: number) => {
    if (!isEditing) return;
    
    setDanos(prev => 
      prev.map(dano => 
        dano.pecaId === pecaId
          ? {
              ...dano,
              amassados: {
                ...dano.amassados,
                [tamanho]: valor < 0 ? 0 : valor,
              },
            }
          : dano
      )
    );
  };

  // Função para atualizar os valores de materiais
  const handleMateriaisChange = (pecaId: string, material: keyof DanoVeiculo['materiais'], checked: boolean) => {
    if (!isEditing) return;
    
    setDanos(prev => 
      prev.map(dano => 
        dano.pecaId === pecaId
          ? {
              ...dano,
              materiais: {
                ...dano.materiais,
                [material]: checked,
              },
            }
          : dano
      )
    );
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const orcamentoData: Omit<OrcamentoDetalhado, 'id'> = {
        data: values.data.toISOString(),
        clienteId: values.clienteId,
        veiculo: values.veiculo,
        placa: values.placa,
        chassi: values.chassi,
        danos: danos,
        foto: values.foto,
        totalAW,
        precoEuro,
      };

      let result;
      if (orcamentoId) {
        // Atualiza orçamento existente
        result = orcamentoService.updateOrcamento(orcamentoId, orcamentoData);
        if (result) {
          toast.success("Orçamento atualizado com sucesso!");
          setIsEditing(false);
        } else {
          toast.error("Erro ao atualizar orçamento!");
        }
      } else {
        // Cria novo orçamento
        result = orcamentoService.addOrcamento(orcamentoData);
        if (result) {
          toast.success("Orçamento criado com sucesso!");
          navigate(`/orcamentos/${result.id}`);
        } else {
          toast.error("Erro ao criar orçamento!");
        }
      }
    } catch (error) {
      console.error("Erro ao salvar orçamento:", error);
      toast.error("Ocorreu um erro ao salvar o orçamento");
    }
  };

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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {orcamentoId 
            ? (isEditing ? "Editar Orçamento" : "Detalhes do Orçamento") 
            : "Novo Orçamento"}
        </h1>
        {orcamentoId && isReadOnly && (
          <Button onClick={() => setIsEditing(true)}>
            Editar
          </Button>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Primeira linha: data e cliente */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo de data */}
            <FormField
              control={form.control}
              name="data"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Data</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!isEditing}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>Selecione uma data</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        disabled={!isEditing}
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campo de cliente */}
            <FormField
              control={form.control}
              name="clienteId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    disabled={!isEditing}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clientes.map((cliente) => (
                        <SelectItem key={cliente.id} value={cliente.id}>
                          {cliente.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Segunda linha: veículo, placa e chassi */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="veiculo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Veículo</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <Car className="mr-2 h-4 w-4 mt-3" />
                      <Input 
                        placeholder="Modelo do veículo" 
                        {...field} 
                        disabled={!isEditing} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="placa"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="AAA-0000" 
                      {...field} 
                      value={field.value || ''} 
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormDescription>
                    Placa ou chassi é obrigatório
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chassi"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Chassi</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Número do chassi" 
                      {...field} 
                      value={field.value || ''} 
                      disabled={!isEditing}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Grid de danos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Danos do Veículo</h2>
            
            <div className="grid grid-cols-3 gap-4">
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

            {/* Totais e Legenda */}
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
          </div>

          {/* Botões de ação */}
          <div className="flex justify-end space-x-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/orcamentos')}
            >
              Cancelar
            </Button>
            
            {isEditing && (
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Salvar
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}

// Componente para edição de danos em uma peça específica
interface DanoPecaEditorProps {
  dano: DanoVeiculo;
  onChange: (tamanho: keyof DanoVeiculo['amassados'], valor: number) => void;
  onMaterialChange: (material: keyof DanoVeiculo['materiais'], checked: boolean) => void;
  disabled?: boolean;
}

function DanoPecaEditor({ dano, onChange, onMaterialChange, disabled = false }: DanoPecaEditorProps) {
  return (
    <div className="space-y-3">
      {/* Amassados */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm">20mm</label>
          <Input
            type="number"
            value={dano.amassados.mm20}
            onChange={(e) => onChange('mm20', parseInt(e.target.value) || 0)}
            className="w-16 text-center p-1 h-8"
            min={0}
            disabled={disabled}
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="text-sm">30mm</label>
          <Input
            type="number"
            value={dano.amassados.mm30}
            onChange={(e) => onChange('mm30', parseInt(e.target.value) || 0)}
            className="w-16 text-center p-1 h-8"
            min={0}
            disabled={disabled}
          />
        </div>
        <div className="flex justify-between items-center">
          <label className="text-sm">40mm</label>
          <Input
            type="number"
            value={dano.amassados.mm40}
            onChange={(e) => onChange('mm40', parseInt(e.target.value) || 0)}
            className="w-16 text-center p-1 h-8"
            min={0}
            disabled={disabled}
          />
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
