import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

import { orcamentoService, pecasVeiculo } from '@/services/orcamentoService';
import { clienteService } from '@/services/clienteService';
import { DanoVeiculo, OrcamentoDetalhado } from '@/types';
import { OrcamentoCabecalho } from './OrcamentoCabecalho';
import { DanosVeiculoGrid } from './DanosVeiculoGrid';
import { OrcamentoTotais } from './OrcamentoTotais';

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
  observacoes: z.string().optional(),
}).refine(data => data.placa || data.chassi, {
  message: "Placa ou Chassi é obrigatório",
  path: ["placa"],
});

interface OrcamentoFormProps {
  orcamentoId?: string;
  orcamento?: OrcamentoDetalhado;
  isReadOnly?: boolean;
  onCancel: () => void;
  onSave?: () => void;
}

export default function OrcamentoForm({ orcamentoId, orcamento, isReadOnly = false, onCancel, onSave }: OrcamentoFormProps) {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<any[]>([]);
  const [danos, setDanos] = useState<DanoVeiculo[]>([]);
  const [totalAW, setTotalAW] = useState(0);
  const [precoEuro, setPrecoEuro] = useState(0);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    setIsEditing(!isReadOnly);
  }, [isReadOnly]);

  // Inicializa o formulário com react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: orcamento ? {
      data: new Date(orcamento.data),
      clienteId: orcamento.clienteId,
      veiculo: orcamento.veiculo,
      placa: orcamento.placa || "",
      chassi: orcamento.chassi || "",
      foto: orcamento.foto,
      observacoes: orcamento.observacoes || "",
    } : {
      data: new Date(),
      veiculo: "",
      placa: "",
      chassi: "",
      observacoes: "",
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
          observacoes: orcamento.observacoes || "",
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
        observacoes: values.observacoes,
      };

      let result;
      if (orcamentoId) {
        // Atualiza orçamento existente
        result = orcamentoService.updateOrcamento(orcamentoId, orcamentoData);
        if (result) {
          toast.success("Orçamento atualizado com sucesso!");
          setIsEditing(false);
          if (onSave) onSave();
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

  return (
    <div className="flex flex-col w-full min-w-[300px] sm:min-w-[800px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex-1 bg-white px-4 py-5 sm:p-6">
          {/* Cabeçalho do formulário */}
          <OrcamentoCabecalho 
            form={form} 
            clientes={clientes} 
            isEditing={isEditing} 
          />

          {/* Grid de danos */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Danos do Veículo</h2>

            <DanosVeiculoGrid 
              danos={danos}
              isEditing={isEditing}
              handleAmassadosChange={handleAmassadosChange}
              handleMateriaisChange={handleMateriaisChange}
            />

            {/* Totais e Legenda */}
            <OrcamentoTotais 
              totalAW={totalAW} 
              precoEuro={precoEuro} 
            />
          </div>

          </div>

          {/* Botões de ação */}
          <div className="bg-white p-4 flex flex-col sm:flex-row justify-end gap-3 border-t shadow-[0_-1px_3px_rgba(0,0,0,0.1)]">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            {isEditing && (
              <Button type="submit" className="w-full sm:w-auto">
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
