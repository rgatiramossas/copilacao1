
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Plus, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { OrdemServico, StatusOS } from '@/types';
import { ordemServicoService } from '@/services/ordemServicoService';
import { clienteService } from '@/services/clienteService';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

// Schema de validação
const formSchema = z.object({
  clienteId: z.string().min(1, 'Cliente é obrigatório'),
  dataAbertura: z.date({ required_error: 'Data é obrigatória' }),
  veiculo: z.string().min(1, 'Veículo é obrigatório'),
  placa: z.string().optional(),
  chassi: z.string().optional(),
  tipoServico: z.enum(['Granizo', 'Amassado de Rua', 'Outros'], {
    required_error: 'Tipo de serviço é obrigatório',
  }),
  observacoes: z.string().optional(),
  precoTecnico: z.number().optional(),
  precoAdministrativo: z.number().optional(),
  status: z.enum(['em_andamento', 'concluido', 'em_aprovacao', 'aprovado', 'faturado', 'pago', 'cancelado']),
}).refine(data => data.placa || data.chassi, {
  message: 'Pelo menos um dos campos (Placa ou Chassi) deve ser preenchido',
  path: ['placa'],
});

type FormValues = z.infer<typeof formSchema>;

interface EditarOrdemServicoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  ordem: OrdemServico;
  onSucesso: (osAtualizada: OrdemServico) => void;
}

const EditarOrdemServicoDialog: React.FC<EditarOrdemServicoDialogProps> = ({ 
  isOpen, 
  onClose, 
  ordem,
  onSucesso 
}) => {
  const [fotos, setFotos] = useState<string[]>(ordem.fotos || []);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const { userRole } = useAuth();
  const isAdmin = userRole === 'administrador' || userRole === 'gestor';
  const isTecnico = userRole === 'tecnico';
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clienteId: ordem.clienteId,
      dataAbertura: ordem.dataAbertura ? parseISO(ordem.dataAbertura) : new Date(),
      veiculo: ordem.veiculo,
      placa: ordem.placa || '',
      chassi: ordem.chassi || '',
      tipoServico: ordem.tipoServico,
      observacoes: ordem.observacoes || '',
      precoTecnico: ordem.precoTecnico,
      precoAdministrativo: ordem.precoAdministrativo,
      status: ordem.status,
    },
  });
  
  useEffect(() => {
    if (isOpen) {
      form.reset({
        clienteId: ordem.clienteId,
        dataAbertura: ordem.dataAbertura ? parseISO(ordem.dataAbertura) : new Date(),
        veiculo: ordem.veiculo,
        placa: ordem.placa || '',
        chassi: ordem.chassi || '',
        tipoServico: ordem.tipoServico,
        observacoes: ordem.observacoes || '',
        precoTecnico: ordem.precoTecnico,
        precoAdministrativo: ordem.precoAdministrativo,
        status: ordem.status,
      });
      setFotos(ordem.fotos || []);
    }
  }, [isOpen, ordem, form]);
  
  const clientes = clienteService.getClientes();
  
  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = e.target.files;
    
    if (!files) return;
    
    if (fotos.length + files.length > 6) {
      setUploadError('Máximo de 6 fotos permitido');
      return;
    }
    
    // Simulação de upload - em uma aplicação real, faríamos upload para um servidor
    // Aqui vamos apenas usar o placeholder
    const novosArquivos = Array.from(files).map(() => '/placeholder.svg');
    setFotos([...fotos, ...novosArquivos]);
  };
  
  const removerFoto = (index: number) => {
    setFotos(fotos.filter((_, i) => i !== index));
    setUploadError(null);
  };
  
  const onSubmit = (values: FormValues) => {
    if (fotos.length === 0) {
      setUploadError('Pelo menos uma foto é obrigatória');
      return;
    }
    
    // Verificar se o usuário tem permissão para mudar o status
    if (values.status !== ordem.status) {
      const podeMudar = ordemServicoService.podeMudarStatusOS(
        userRole || '',
        ordem.status,
        values.status
      );
      
      if (!podeMudar) {
        toast.error('Você não tem permissão para mudar o status desta ordem de serviço');
        return;
      }
    }
    
    try {
      const osAtualizada = ordemServicoService.updateOrdemServico(ordem.id, {
        clienteId: values.clienteId,
        dataAbertura: values.dataAbertura.toISOString(),
        veiculo: values.veiculo,
        placa: values.placa || undefined,
        chassi: values.chassi || undefined,
        tipoServico: values.tipoServico,
        fotos: fotos,
        observacoes: values.observacoes,
        precoTecnico: values.precoTecnico,
        precoAdministrativo: isAdmin ? values.precoAdministrativo : ordem.precoAdministrativo,
        status: values.status,
      });
      
      if (osAtualizada) {
        onSucesso(osAtualizada);
      } else {
        toast.error('Erro ao atualizar ordem de serviço');
      }
    } catch (error) {
      toast.error('Erro ao atualizar ordem de serviço');
      console.error(error);
    }
  };

  // Define opções de status disponíveis com base no perfil do usuário e status atual
  const getStatusOptions = () => {
    if (isAdmin) {
      // Administradores e gestores podem selecionar qualquer status
      return [
        { value: 'em_andamento', label: 'Em Andamento' },
        { value: 'concluido', label: 'Concluído' },
        { value: 'em_aprovacao', label: 'Em Aprovação' },
        { value: 'aprovado', label: 'Aprovado' },
        { value: 'faturado', label: 'Faturado' },
        { value: 'pago', label: 'Pago' },
        { value: 'cancelado', label: 'Cancelado' }
      ];
    } else if (isTecnico) {
      // Técnicos têm opções limitadas de acordo com o status atual
      if (ordem.status === 'em_andamento') {
        return [
          { value: 'em_andamento', label: 'Em Andamento' },
          { value: 'concluido', label: 'Concluído' }
        ];
      } else {
        // Se já está concluído, não pode mudar o status
        return [
          { value: ordem.status, label: ordem.status === 'concluido' ? 'Concluído' : 'Em Andamento' }
        ];
      }
    }
    
    // Default
    return [
      { value: ordem.status, label: 'Status atual' }
    ];
  };
  
  const statusOptions = getStatusOptions();
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Ordem de Serviço #{ordem.id}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
              {/* Cliente */}
              <FormField
                control={form.control}
                name="clienteId"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Cliente*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isTecnico && ordem.status !== 'em_andamento'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um cliente" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clientes.map(cliente => (
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
              
              {/* Data de abertura */}
              <FormField
                control={form.control}
                name="dataAbertura"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data*</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                            disabled={isTecnico && ordem.status !== 'em_andamento'}
                          >
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: ptBR })
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
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value as StatusOS}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Tipo de serviço */}
              <FormField
                control={form.control}
                name="tipoServico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Serviço*</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      value={field.value}
                      disabled={isTecnico && ordem.status !== 'em_andamento'}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Granizo">Granizo</SelectItem>
                        <SelectItem value="Amassado de Rua">Amassado de Rua</SelectItem>
                        <SelectItem value="Outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Veículo */}
              <FormField
                control={form.control}
                name="veiculo"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Veículo*</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Volkswagen Golf 2020" 
                        {...field}
                        disabled={isTecnico && ordem.status !== 'em_andamento'} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Placa */}
              <FormField
                control={form.control}
                name="placa"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Placa</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Placa do veículo" 
                        {...field} 
                        disabled={isTecnico && ordem.status !== 'em_andamento'} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Chassi */}
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
                        disabled={isTecnico && ordem.status !== 'em_andamento'} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Preço Técnico */}
              <FormField
                control={form.control}
                name="precoTecnico"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Técnico (€)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00"
                        onChange={(e) => {
                          const value = e.target.value ? parseFloat(e.target.value) : undefined;
                          field.onChange(value);
                        }}
                        value={field.value || ''}
                        disabled={isTecnico && ordem.status !== 'em_andamento'}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Preço Administrativo - só visível para administradores */}
              {isAdmin && (
                <FormField
                  control={form.control}
                  name="precoAdministrativo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Administrativo (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00"
                          onChange={(e) => {
                            const value = e.target.value ? parseFloat(e.target.value) : undefined;
                            field.onChange(value);
                          }}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {/* Observações */}
              <FormField
                control={form.control}
                name="observacoes"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Detalhes adicionais sobre o serviço" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Upload de fotos */}
              <div className="sm:col-span-2">
                <FormLabel>Fotos*</FormLabel>
                <div className="mt-1">
                  <div className="flex items-center justify-center w-full border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                      <div className="flex flex-col items-center justify-center">
                        <Plus className="h-6 w-6 text-gray-400" />
                        <p className="text-sm text-gray-500">Adicionar fotos (máx. 6)</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        multiple 
                        onChange={handleFotoUpload}
                        disabled={isTecnico && ordem.status !== 'em_andamento'}
                      />
                    </label>
                  </div>
                </div>
                
                {uploadError && (
                  <p className="text-sm font-medium text-destructive mt-1">{uploadError}</p>
                )}
                
                {fotos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {fotos.map((foto, index) => (
                      <div key={index} className="relative border rounded-md overflow-hidden aspect-square">
                        <img src={foto} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removerFoto(index)}
                          className="absolute top-1 right-1 bg-destructive text-white rounded-full p-1"
                          disabled={isTecnico && ordem.status !== 'em_andamento'}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarOrdemServicoDialog;
